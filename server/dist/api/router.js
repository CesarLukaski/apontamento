"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const mssql_1 = __importDefault(require("mssql"));
const global_config_1 = require("../global.config");
const pictures_1 = require("./pictures");
const apiRouter = (0, express_1.Router)();
apiRouter.route("/apontamento")
    .post(async (req, res) => {
    req.body["codigoBarras"] = sanitize(req.body["codigoBarras"].trim());
    let barcode = req.body["codigoBarras"];
    function sanitize(input) {
        const allowedChars = /[A-Za-z0-9]/;
        return input.split("").map((char) => (allowedChars.test(char) ? char : "")).join("");
    }
    if (barcode == '') {
        res.status(400).redirect("/#/codigobarras?error=invalidBarcode");
    }
    const dados = {
        numOdf: Number(barcode.slice(10)),
        numOper: String(barcode.slice(0, 5)),
        codMaq: String(barcode.slice(5, 10)),
    };
    const connection = await mssql_1.default.connect(global_config_1.sqlConfig);
    const resource = await connection.query(`
                        SELECT TOP 1
                        [NUMERO_ODF], 
                        [CODIGO_MAQUINA],
                        [NUMERO_OPERACAO],
                        [CODIGO_PECA]
                        FROM            
                        PCP_PROGRAMACAO_PRODUCAO
                        WHERE 1 = 1
                        AND [NUMERO_ODF] = ${dados.numOdf}
                        AND [CODIGO_MAQUINA] = '${dados.codMaq}'
                        AND [NUMERO_OPERACAO] = ${dados.numOper}
                        AND [CODIGO_PECA] IS NOT NULL
                        ORDER BY NUMERO_OPERACAO ASC
                        `.trim()).then(result => result.recordset);
    res.cookie("NUMERO_ODF", dados.numOdf);
    res.cookie("CODIGO_PECA", resource[0].CODIGO_PECA);
    res.cookie("CODIGO_MAQUINA", resource[0].CODIGO_MAQUINA);
    res.cookie("NUMERO_OPERACAO", resource[0].NUMERO_OPERACAO);
    if (resource.length > 0) {
        try {
            const resource2 = await connection.query(`
                        SELECT DISTINCT                 
                           OP.NUMITE,                 
                           CAST(OP.EXECUT AS INT) AS EXECUT,       
                           CAST(E.SALDOREAL AS INT) AS SALDOREAL,                 
                           CAST(((E.SALDOREAL - ISNULL((SELECT ISNULL(SUM(QUANTIDADE),0) FROM CST_ALOCACAO CA (NOLOCK) WHERE CA.CODIGO_FILHO = E.CODIGO AND CA.ODF = PCP.NUMERO_ODF),0)) / ISNULL(OP.EXECUT,0)) AS INT) AS QTD_LIBERADA_PRODUZIR,
                           ISNULL((SELECT ISNULL(SUM(QUANTIDADE),0) FROM CST_ALOCACAO CA (NOLOCK) WHERE CA.CODIGO_FILHO = E.CODIGO),0) as saldo_alocado
                           FROM PROCESSO PRO (NOLOCK)                  
                           INNER JOIN OPERACAO OP (NOLOCK) ON OP.RECNO_PROCESSO = PRO.R_E_C_N_O_                  
                           INNER JOIN ESTOQUE E (NOLOCK) ON E.CODIGO = OP.NUMITE                
                           INNER JOIN PCP_PROGRAMACAO_PRODUCAO PCP (NOLOCK) ON PCP.CODIGO_PECA = OP.NUMPEC                
                           WHERE 1=1                    
                           AND PRO.ATIVO ='S'                   
                           AND PRO.CONCLUIDO ='T'                
                           AND OP.CONDIC ='P'                 
                           AND PCP.NUMERO_ODF = '${dados.numOdf}'    
                        `.trim()).then(result => result.recordset);
            console.log("resource2:78", resource2);
            function calMaxQuant(qtdNecessPorPeca, saldoReal) {
                const pecasPaiPorComponente = qtdNecessPorPeca.map((qtdPorPeca, i) => {
                    return Math.floor((saldoReal[i] || 0) / qtdPorPeca);
                });
                const qtdMaxProduzivel = pecasPaiPorComponente.reduce((qtdMax, pecasPorComp) => {
                    return Math.min(qtdMax, pecasPorComp);
                }, Infinity);
                Math.round(qtdMaxProduzivel);
                return (qtdMaxProduzivel === Infinity ? 0 : qtdMaxProduzivel);
            }
            const execut = resource2.map(item => item.EXECUT);
            const saldoReal = resource2.map(item => item.SALDOREAL);
            console.log("execut:99", execut, "saldoReal:99", saldoReal);
            let qtdTotal = calMaxQuant(execut, saldoReal);
            console.log("qtdTotal", qtdTotal);
            const reservedItens = execut.map((quantItens) => {
                return Math.floor((qtdTotal || 0) * quantItens);
            }, Infinity);
            let reserved = res.cookie("reservedItens", reservedItens);
            Number(reserved);
            const codigoFilho = resource2.map(item => item.NUMITE);
            res.cookie("codigoFilho", codigoFilho);
            console.log("codigoFilho:115", codigoFilho);
            try {
                const updateQtyQuery = [];
                const updateQtyRes = [];
                for (const [i, qtdItem] of reservedItens.entries()) {
                    updateQtyQuery.push(`UPDATE CST_ALOCACAO SET  QUANTIDADE = QUANTIDADE + ${qtdItem} WHERE 1 = 1 AND ODF = '${dados.numOdf}' AND CODIGO_FILHO = '${codigoFilho[i]}';`);
                }
                const updateQty = await connection.query(updateQtyQuery.join("\n"));
                for (const [i, qtdItem] of reservedItens.entries()) {
                    updateQtyRes.push(`UPDATE CST_ALOCACAO SET  QUANTIDADE = QUANTIDADE + ${qtdItem} WHERE 1 = 1 AND ODF = '${dados.numOdf}' AND CODIGO_FILHO = '${codigoFilho[i]}';`);
                }
                const updateRes = await connection.query(updateQtyRes.join("\n"));
                console.log("updateQty:132", updateQty);
                console.log("updateRes:142", updateRes);
                return res.status(200).redirect("/#/codigobarras?red=red");
            }
            catch (err) {
                console.log("Erro:135", err);
                return res.status(400).redirect("/#/codigobarras?error=invalidBarcode");
            }
        }
        catch (error) {
            console.log("erro linha 138", error);
            return res.status(400).redirect("/#/codigobarras?error=invalidBarcode");
        }
        finally {
            await connection.close();
        }
    }
    else {
        console.log("Não encontrou ODF com esse número");
        return res.status(400).redirect("/#/codigobarras?error=invalidBarcode");
    }
});
apiRouter.route("/apontamentoCracha")
    .post(async (req, res) => {
    let finalTimer = 6000000;
    let maxRange = finalTimer;
    let MATRIC = req.body["MATRIC"].trim();
    function sanitize(input) {
        const allowedChars = /[A-Za-z0-9]/;
        return input.split("").map((char) => (allowedChars.test(char) ? char : "")).join("");
    }
    MATRIC = sanitize(MATRIC);
    if (MATRIC == '') {
        res.status(400).redirect("/#/codigobarras?error=invalidBadge");
    }
    const connection = await mssql_1.default.connect(global_config_1.sqlConfig);
    try {
        const resource = await connection.query(` 
                SELECT TOP 1
                [MATRIC],
                [FUNCIONARIO]
                FROM FUNCIONARIOS
                WHERE 1 = 1
                AND [MATRIC] = ${MATRIC}
                `.trim()).then(result => result.recordset);
        if (resource.length > 0) {
            let start = new Date();
            let mili = start.getMilliseconds();
            console.log(mili / 1000);
            res.cookie("starterBarcode", start.getTime());
            res.cookie("MATRIC", resource[0].MATRIC, { httpOnly: true, maxAge: maxRange });
            res.cookie("FUNCIONARIO", resource[0].FUNCIONARIO);
            res.status(200).redirect("/#/codigobarras?status=ok");
        }
        else {
            res.status(404).redirect("/#/codigobarras?error=invalidBadge");
        }
    }
    catch (error) {
        res.status(404).redirect("/#/codigobarras?error=invalidBadge");
    }
    finally {
        await connection.close();
    }
});
apiRouter.route("/odf")
    .get(async (req, res) => {
    let NUMERO_ODF = req.cookies["NUMERO_ODF"];
    let CODIGO_MAQUINA = req.cookies["CODIGO_MAQUINA"];
    let NUMERO_OPERACAO = req.cookies["NUMERO_OPERACAO"];
    const connection = await mssql_1.default.connect(global_config_1.sqlConfig);
    try {
        const resource = await connection.query(`
                SELECT TOP 1
                [CODIGO_CLIENTE],
                [QTDE_ODF],
                [CODIGO_PECA],
                [DT_INICIO_OP],
                [DT_FIM_OP],
                [QTDE_ODF],
                [QTDE_APONTADA],
                [DT_ENTREGA_ODF],
                [QTD_REFUGO],
                [HORA_INICIO],
                [HORA_FIM]
                FROM PCP_PROGRAMACAO_PRODUCAO
                WHERE 1 = 1
                AND [NUMERO_ODF] = ${NUMERO_ODF}
                AND [CODIGO_MAQUINA] = '${CODIGO_MAQUINA}'
                AND [NUMERO_OPERACAO] = ${NUMERO_OPERACAO}
                ORDER BY NUMERO_OPERACAO ASC`.trim()).then(result => result.recordset);
        res.json(resource);
    }
    catch (error) {
        console.log(error);
    }
    finally {
        await connection.close();
    }
});
apiRouter.route("/imagem")
    .get(async (req, res) => {
    const NUMPEC = req.cookies["CODIGO_PECA"];
    const connection = await mssql_1.default.connect(global_config_1.sqlConfig);
    let statusImg = "_status";
    try {
        const resource = await connection.query(`
            SELECT TOP 1
            [NUMPEC],
            [IMAGEM]
            FROM PROCESSO (NOLOCK)
            WHERE 1 = 1
            AND NUMPEC = '${NUMPEC}'
            AND IMAGEM IS NOT NULL
            `).then(res => res.recordset);
        let imgResult = [];
        for await (let [i, record] of resource.entries()) {
            const rec = await record;
            const path = await pictures_1.pictures.getPicturePath(rec["NUMPEC"], rec["IMAGEM"], statusImg, String(i));
            imgResult.push(path);
        }
        res.json(imgResult);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: true, message: "Erro no servidor." });
    }
    finally {
        await connection.close();
    }
});
apiRouter.route("/status")
    .get(async (req, res) => {
    const connection = await mssql_1.default.connect(global_config_1.sqlConfig);
    try {
        const resource = await connection.query(`
            SELECT TOP 1 EXECUT FROM OPERACAO
            `).then(record => record.recordset);
        res.cookie("Tempo Execucao", resource[0].EXECUT);
        let reservedItens = req.cookies["reservedItens"];
        Number(reservedItens);
        console.log(reservedItens);
        let result = Number(resource[0].EXECUT * 1000);
        let newR = Number(result * 5);
        console.log(newR);
        res.json(newR);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: true, message: "Erro no servidor." });
    }
    finally {
        await connection.close();
    }
});
apiRouter.route("/HISTORICO")
    .get(async (req, res) => {
    let NUMERO_ODF = req.cookies["NUMERO_ODF"];
    const connection = await mssql_1.default.connect(global_config_1.sqlConfig);
    try {
        const resource = await connection.query(`
            SELECT
            *
            FROM VW_APP_APONTAMENTO_HISTORICO
            WHERE 1 = 1
            AND ODF = '${NUMERO_ODF}'
            `.trim()).then(result => result.recordset);
        return res.json(resource);
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ error: true, message: "Erro no servidor." });
    }
    finally {
        await connection.close();
    }
});
apiRouter.route("/ferramenta")
    .get(async (_req, res) => {
    const connection = await mssql_1.default.connect(global_config_1.sqlConfig);
    let startProd = new Date();
    startProd.getMilliseconds();
    res.cookie("startProd", startProd.getTime());
    let CODIGO = '00241888';
    let ferramenta = "_ferr";
    try {
        const resource = await connection.query(`
                SELECT
                    [CODIGO],
                    [IMAGEM]
                FROM VIEW_APTO_FERRAMENTAL 
                WHERE 1 = 1 
                    AND IMAGEM IS NOT NULL
                    AND CODIGO = '${CODIGO}'
            `).then(res => res.recordset);
        let result = [];
        for await (let [i, record] of resource.entries()) {
            const rec = await record;
            const path = await pictures_1.pictures.getPicturePath(rec["CODIGO"], rec["IMAGEM"], ferramenta, String(i));
            result.push(path);
        }
        return res.status(200).json(result);
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ error: true, message: "Erro no servidor." });
    }
    finally {
        await connection.close();
    }
});
apiRouter.route("/ferselecionadas")
    .get(async (req, res) => {
    console.log("ta aqui");
    let final = '0.0040';
    let numero_odf = '1378773';
    const connection = await mssql_1.default.connect(global_config_1.sqlConfig);
    try {
        let end = new Date();
        let start = req.cookies["starterBarcode"];
        const insertSql = await connection.query(`UPDATE HISAPONTA SET TEMPO_SETUP = TEMPO_SETUP + '${final}' WHERE 1 = 1 AND ODF = '${numero_odf}'`);
        console.log("Insert: linha 356:", insertSql);
        return res.status(200).json();
    }
    catch (error) {
        console.log(error);
        return res.status(400).redirect("/#/ferramenta");
    }
    finally {
        await connection.close();
    }
});
apiRouter.route("/apontar")
    .post(async (req, res) => {
    let NUMERO_ODF = req.cookies["NUMERO_ODF"].trim();
    let NUMERO_OPERACAO = req.cookies["NUMERO_OPERACAO"].trim();
    let CODIGO_MAQUINA = req.cookies["CODIGO_MAQUINA"].trim();
    let EMPRESA_RECNO = 1;
    let QTDE_APONTADA = req.body["goodFeed"].trim();
    let QTD_REFUGO = req.body["badfeed"].trim();
    let CST_PC_FALTANTE = req.body["reworkFeed"].trim();
    let CST_QTD_RETRABALHADA = req.body["missingFeed"].trim();
    let startRip = new Date();
    let mili = startRip.getMilliseconds();
    console.log("mili: linha 428", mili / 1000);
    res.cookie("startRip", startRip.getTime());
    let input = req.body.trim();
    function sanitize(input) {
        const allowedChars = /[A-Za-z0-9]/;
        return input
            .split("")
            .map((char) => (allowedChars.test(char) ? char : ""))
            .join("");
    }
    input = sanitize(input);
    const connection = await mssql_1.default.connect(global_config_1.sqlConfig);
    var codigoFilho = req.cookies['codigoFilho'];
    var reservedItens = req.cookies['reservedItens'];
    try {
        const updateQtyQuery = [];
        const updateQtyRes = [];
        for (const [i, qtdItem] of reservedItens.entries()) {
            updateQtyQuery.push(`UPDATE CST_ALOCACAO SET  QUANTIDADE = QUANTIDADE + ${qtdItem} WHERE 1 = 1 AND ODF = '${NUMERO_ODF}' AND CODIGO_FILHO = '${codigoFilho[i]}'`);
        }
        const updateQty = await connection.query(updateQtyQuery.join("\n"));
        for (const [i, qtdItem] of reservedItens.entries()) {
            updateQtyRes.push(`UPDATE CST_ALOCACAO SET  QUANTIDADE = QUANTIDADE + ${qtdItem} WHERE 1 = 1 AND ODF = '${NUMERO_ODF}' AND CODIGO_FILHO = '${codigoFilho[i]}'`);
        }
        const updateRes = await connection.query(updateQtyRes.join("\n"));
        console.log("updateQty:132", updateQty);
        console.log("updateRes:142", updateRes);
        res.status(200).redirect(`/#/rip`);
    }
    catch (err) {
        console.log("Erro:135", err);
        res.status(400).redirect("/#/codigobarras/apontamento");
    }
    try {
        let endProdTimer = new Date();
        let startProd = req.cookies["startProd"];
        let finalProdTimer = endProdTimer.getTime() - Number(startProd);
        console.log("Primeira operação: " + finalProdTimer / 1000 + " segundos");
        const insertSqlRework = await connection.query('INSERT INTO HISAPONTA(CST_PC_FALTANTE, CST_QTD_RETRABALHADA) VALUES (' + CST_PC_FALTANTE + ',' + CST_QTD_RETRABALHADA + ')');
        console.log(insertSqlRework);
        const insertSql = await connection.query('INSERT INTO PCP_PROGRAMACAO_PRODUCAO(NUMERO_ODF,NUMERO_OPERACAO,CODIGO_MAQUINA,EMPRESA_RECNO, QTDE_APONTADA, QTD_REFUGO) VALUES (' + NUMERO_ODF + ',' + NUMERO_OPERACAO + ',' + CODIGO_MAQUINA + ',' + EMPRESA_RECNO + ',' + QTDE_APONTADA + ',' + QTD_REFUGO + ')');
        console.log(insertSql);
        const insertSqlTimer = await connection.query('INSERT INTO HISAPONTA(APT_TEMPO_OPERACAO) VALUES (' + finalProdTimer + ')');
        console.log(insertSqlTimer);
        res.status(200).redirect(`/#/rip`);
    }
    catch (error) {
        res.redirect(`/#/codigobarras/apontamento?erro=apontamentoInvalido`);
    }
    finally {
        await connection.close();
    }
});
apiRouter.route("/rip")
    .get(async (req, res) => {
    var NUMERO_ODF = '1232975';
    let NUMPEC = '00240070';
    let REVISAO = '02';
    let NUMCAR = '2999';
    let startRip = new Date();
    let mili = startRip.getMilliseconds();
    console.log(mili / 1000);
    res.cookie("startRip", startRip.getTime());
    const connection = await mssql_1.default.connect(global_config_1.sqlConfig);
    try {
        const resource = await connection.query(`
            SELECT  DISTINCT
            PROCESSO.NUMPEC,
            PROCESSO.REVISAO,
            QA_CARACTERISTICA.NUMCAR AS NUMCAR,
            QA_CARACTERISTICA.CST_NUMOPE AS CST_NUMOPE,
            QA_CARACTERISTICA.DESCRICAO,
            ESPECIFICACAO  AS ESPECIF,
            LIE,
            LSE,
            QA_CARACTERISTICA.INSTRUMENTO
            FROM PROCESSO
            INNER JOIN CLIENTES ON PROCESSO.RESUCLI = CLIENTES.CODIGO
            INNER JOIN QA_CARACTERISTICA ON QA_CARACTERISTICA.NUMPEC=PROCESSO.NUMPEC
            AND QA_CARACTERISTICA.REV_QA=PROCESSO.REV_QA 
            AND QA_CARACTERISTICA.REVISAO = PROCESSO.REVISAO 
            LEFT JOIN (SELECT OP.MAQUIN, OP.NUMPEC, OP.RECNO_PROCESSO, LTRIM(NUMOPE) AS CST_SEQUENCIA  
            FROM OPERACAO OP (NOLOCK)) AS TBL ON TBL.RECNO_PROCESSO = PROCESSO.R_E_C_N_O_  AND TBL.MAQUIN = QA_CARACTERISTICA.CST_NUMOPE
			WHERE PROCESSO.NUMPEC = '${NUMPEC}' 
            AND PROCESSO.REVISAO = '${REVISAO}' 
            AND NUMCAR < '${NUMCAR}'
            ORDER BY NUMPEC ASC
                `.trim()).then(result => result.recordset);
        try {
            const resource = await connection.query(`
                SELECT DISTINCT                 
                   OP.NUMITE,                 
                   CAST(OP.EXECUT AS INT) AS EXECUT,       
                   CAST(E.SALDOREAL AS INT) AS SALDOREAL,                 
                   CAST(((E.SALDOREAL - ISNULL((SELECT ISNULL(SUM(QUANTIDADE),0) FROM CST_ALOCACAO CA (NOLOCK) WHERE CA.CODIGO_FILHO = E.CODIGO AND CA.ODF = PCP.NUMERO_ODF),0)) / ISNULL(OP.EXECUT,0)) AS INT) AS QTD_LIBERADA_PRODUZIR,
                   ISNULL((SELECT ISNULL(SUM(QUANTIDADE),0) FROM CST_ALOCACAO CA (NOLOCK) WHERE CA.CODIGO_FILHO = E.CODIGO),0) as saldo_alocado
                   FROM PROCESSO PRO (NOLOCK)                  
                   INNER JOIN OPERACAO OP (NOLOCK) ON OP.RECNO_PROCESSO = PRO.R_E_C_N_O_                  
                   INNER JOIN ESTOQUE E (NOLOCK) ON E.CODIGO = OP.NUMITE                
                   INNER JOIN PCP_PROGRAMACAO_PRODUCAO PCP (NOLOCK) ON PCP.CODIGO_PECA = OP.NUMPEC                
                   WHERE 1=1                    
                   AND PRO.ATIVO ='S'                   
                   AND PRO.CONCLUIDO ='T'                
                   AND OP.CONDIC ='P'                 
                   AND PCP.NUMERO_ODF = '${NUMERO_ODF}'    
                `.trim()).then(result => result.recordset);
            console.log("resource: linha 606", resource);
        }
        catch (error) {
            console.log(error);
        }
        finally {
            await connection.close();
        }
        let end = new Date();
        let start = req.cookies["starterBarcode"];
        let final = end.getTime() - Number(start);
        console.log("Final: linha 616", final);
        let endProdRip = new Date();
        let startRip = req.cookies["startRip"];
        let finalProdRip = endProdRip.getTime() - Number(startRip);
        console.log("finalProdRip: linha 616", finalProdRip);
        res.json(resource);
    }
    catch (error) {
        console.log(error);
    }
    finally {
        await connection.close();
    }
});
apiRouter.route("/lancamentoRip")
    .post(async (req, res) => {
    let SETUP = req.body["SETUP"].trim();
    let M2 = req.body["M2"].trim();
    let M3 = req.body["M3"].trim();
    let M4 = req.body["M4"].trim();
    let M5 = req.body["M5"].trim();
    let M6 = req.body["M6"].trim();
    function sanitize(input) {
        const allowedChars = /[A-Za-z0-9]/;
        return input
            .split("")
            .map((char) => (allowedChars.test(char) ? char : ""))
            .join("");
    }
    SETUP = sanitize(SETUP);
    const connection = await mssql_1.default.connect(global_config_1.sqlConfig);
    try {
        const resource = await connection.query('INSERT INTO CST_RIP_ODF_PRODUCAO(SETUP, M2,M3,M4,M5,M6) VALUES ('
            + SETUP + ','
            + M2 + ','
            + M3 + ','
            + M4 + ','
            + M5 + ','
            + M6 +
            ')').then(result => result.recordset);
        console.log(resource);
        res.json(resource);
    }
    catch (error) {
        console.log(error);
    }
    finally {
        await connection.close();
    }
});
apiRouter.route("/returnedValue")
    .post(async (req, res) => {
    let returnedvalue = req.body["returnValue"].trim();
    let NUMERO_ODF = req.cookies["returnValue"].trim();
    returnedvalue = sanitize(returnedvalue);
    function sanitize(returnedvalue) {
        const allowedChars = /[A-Za-z0-9]/;
        return returnedvalue
            .split("")
            .map((char) => (allowedChars.test(char) ? char : ""))
            .join("");
    }
    const connection = await mssql_1.default.connect(global_config_1.sqlConfig);
    try {
        const resource = await connection.query(`
                    UPDATE CST_ALOCACAO  SET SALDOREAL =  SALDOREAL - '${returnedvalue}' WHERE 1 = 1 AND ODF = '${NUMERO_ODF}'`);
        console.log(resource);
        res.status(200).json(resource);
    }
    catch (error) {
        console.log(error);
    }
    finally {
        await connection.close();
    }
});
apiRouter.route("/parada")
    .get(async (req, res) => {
    let numeroOdf = req.cookies["NUMERO_ODF"];
    let returnedvalue = req.cookies["returnedValue"];
    const connection = await mssql_1.default.connect(global_config_1.sqlConfig);
    try {
        const resource = await connection.query(`
                    UPDATE CST_ALOCACAO  SET SALDOREAL =  SALDOREAL - '${returnedvalue}' WHERE 1 = 1 AND ODF = '${numeroOdf}'`);
        console.log(resource);
        res.status(200).json(resource);
    }
    catch (error) {
        console.log(error);
    }
    finally {
        await connection.close();
    }
});
apiRouter.route("/pausa")
    .get(async (req, res) => {
    let numeroOdf = req.cookies["NUMERO_ODF"];
    let returnedvalue = req.cookies["returnedValue"];
    const connection = await mssql_1.default.connect(global_config_1.sqlConfig);
    try {
        const resource = await connection.query(`
                    UPDATE CST_ALOCACAO  SET SALDOREAL =  SALDOREAL - '${returnedvalue}' WHERE 1 = 1 AND ODF = '${numeroOdf}'`);
        console.log(resource);
        res.status(200).json(resource);
    }
    catch (error) {
        console.log(error);
    }
    finally {
        await connection.close();
    }
});
apiRouter.route("/desenho")
    .get(async (_req, res) => {
    const connection = await mssql_1.default.connect(global_config_1.sqlConfig);
    const revisao = 3;
    const numpec = _req.cookies["CODIGO_PECA"];
    let desenho = "_desenho";
    try {
        const resource = await connection.query(`
            SELECT
            DISTINCT
                [NUMPEC],
                [IMAGEM],
                [REVISAO]
            FROM  QA_LAYOUT(NOLOCK) 
            WHERE 1 = 1 
                AND NUMPEC = '${numpec}'
                AND REVISAO = ${revisao}
                AND IMAGEM IS NOT NULL`).then(res => res.recordset);
        let imgResult = [];
        for await (let [i, record] of resource.entries()) {
            const rec = await record;
            const path = await pictures_1.pictures.getPicturePath(rec["NUMPEC"], rec["IMAGEM"], desenho, String(i));
            imgResult.push(path);
        }
        return res.status(200).json(imgResult);
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ error: true, message: "Erro no servidor." });
    }
    finally {
        await connection.close();
    }
});
exports.default = apiRouter;
//# sourceMappingURL=router.js.map