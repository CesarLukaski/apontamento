import { RequestHandler } from "express";
import mssql from "mssql";
import sanitize from "sanitize-html";
import { sqlConfig } from "../../global.config";

export const getPoint: RequestHandler = async (req, res, next) => {
    const connection = await mssql.connect(sqlConfig);
    console.log("aqui");
    let NUMERO_ODF = Number(sanitize(req.cookies["NUMERO_ODF"])) || 0
    let qtdBoas = Number(sanitize(req.body["valorFeed"])) || 0;
    const NUMERO_OPERACAO = req.cookies['NUMERO_OPERACAO']
    const CODIGO_MAQUINA = req.cookies['CODIGO_MAQUINA']
    let codigoPeca = String(sanitize(req.cookies['CODIGO_PECA'])) || null
    let funcionario = String(sanitize(req.cookies['FUNCIONARIO'])) || null

    console.log("codigoMaquina", CODIGO_MAQUINA);
    console.log("NUMERO_OPERACAO", NUMERO_OPERACAO);
    try {
        //Caso a operação seja 999 fará baixa no estoque
        if (NUMERO_OPERACAO === "00999") {
            //Caso seja diferente de "EX"
            if (CODIGO_MAQUINA !== 'EX002') {
                const s = await connection.query(`
                    SELECT EE.CODIGO AS COD_PRODUTO, NULL AS COD_PRODUTO_EST, CE.CODIGO,CE.ENDERECO, ISNULL(EE.QUANTIDADE,0) AS QUANTIDADE 
                    FROM CST_CAD_ENDERECOS CE(NOLOCK)
                    LEFT JOIN CST_ESTOQUE_ENDERECOS EE (NOLOCK) ON UPPER(CE.ENDERECO) = UPPER(EE.ENDERECO)
                    WHERE ISNULL(EE.QUANTIDADE,0) > 0 AND CE.ENDERECO LIKE '5%' AND UPPER(EE.CODIGO) = UPPER('00240174-1') 
                        ORDER BY CE.ENDERECO ASC`)
                    .then(result => result.recordset)
                if (s.length > 0) {
                    return res.json(s)
                }

                if (s.length <= 0) {
                    const e = await connection.query(`
                    SELECT EE.CODIGO AS COD_PRODUTO,NULL AS COD_PRODUTO_EST, CE.CODIGO,CE.ENDERECO, ISNULL(EE.QUANTIDADE,0) AS QUANTIDADE 
                    FROM CST_CAD_ENDERECOS CE(NOLOCK)
                    LEFT JOIN CST_ESTOQUE_ENDERECOS EE (NOLOCK) ON UPPER(CE.ENDERECO) = UPPER(EE.ENDERECO)
                    WHERE ISNULL(EE.QUANTIDADE,0) > 0 AND CE.ENDERECO LIKE '5%' AND UPPER(EE.CODIGO) = UPPER('00240174-1') 
                    ORDER BY CE.ENDERECO ASC`)
                        .then(result => result.recordset)
                    return res.json(e)
                }
            }

            //Caso seja igual de "EX"
            if (CODIGO_MAQUINA === 'EX002') {
                const q = await connection.query(`
                    SELECT EE.CODIGO AS COD_PRODUTO,NULL AS COD_PRODUTO_EST, CE.CODIGO,CE.ENDERECO, ISNULL(EE.QUANTIDADE,0) AS QUANTIDADE 
                    FROM CST_CAD_ENDERECOS CE(NOLOCK)
                    LEFT JOIN CST_ESTOQUE_ENDERECOS EE (NOLOCK) ON UPPER(CE.ENDERECO) = UPPER(EE.ENDERECO)
                    WHERE ISNULL(EE.QUANTIDADE,0) > 0 AND CE.ENDERECO LIKE '7%' AND UPPER(EE.CODIGO) = UPPER('00240174') 
                    ORDER BY CE.ENDERECO ASC`)
                    .then(result => result.recordset)
                if (q.length > 0) {
                    return res.json(q)
                }

                if (q.length <= 0) {
                    const l = await connection.query(`
                    SELECT EE.CODIGO AS COD_PRODUTO,NULL AS COD_PRODUTO_EST, CE.CODIGO,CE.ENDERECO, ISNULL(EE.QUANTIDADE,0) AS QUANTIDADE 
                    FROM CST_CAD_ENDERECOS CE(NOLOCK)
                    LEFT JOIN CST_ESTOQUE_ENDERECOS EE (NOLOCK) ON UPPER(CE.ENDERECO) = UPPER(EE.ENDERECO)
                    WHERE ISNULL(EE.QUANTIDADE,0) <= 0 AND CE.ENDERECO LIKE '7%' 
                    ORDER BY CE.ENDERECO ASC`)
                        .then(result => result.recordset)
                    return res.json(l)
                }
            }

        }
    } catch (error) {
        console.log(error);
        return res.json({ message: 'erro ao em localizar espaço' })
    }
    try {
        const hisReal = await connection.query(`SELECT TOP 1 SALDO FROM  HISREAL WHERE 1 = 1`).then(record => record.recordset)
        console.log("linha 105", hisReal);
        try {
            const insertHisReal = await connection.query(`
        INSERT INTO HISREAL
            (CODIGO, DOCUMEN, DTRECEB, QTRECEB, VALPAGO, FORMA, SALDO, DATA, LOTE, USUARIO, ODF, NOTA, LOCAL_ORIGEM, LOCAL_DESTINO, CUSTO_MEDIO, CUSTO_TOTAL, CUSTO_UNITARIO, CATEGORIA, DESCRICAO, EMPRESA_RECNO, ESTORNADO_APT_PRODUCAO, CST_ENDERECO, VERSAOSISTEMA, CST_SISTEMA,CST_HOSTNAME,CST_IP) 
        SELECT 
            CODIGO, '${NUMERO_ODF}/${codigoPeca}', GETDATE(), 15, 0 , 'E', ${hisReal}, GETDATE(), '0', '${funcionario}', '${NUMERO_ODF}', '0', '0', '0', 0, 0, 0, '0', 'DESCRI', 1, 'E', '6A01A02-5', 1.00, 'APONTAMENTO', 'MART069', '192.168.97.60'
        FROM ESTOQUE(NOLOCK)
        WHERE 1 = 1 
        AND CODIGO = '${codigoPeca}' 
        GROUP BY CODIGO`).then(result => result.recordset)
            next()
            if (insertHisReal.length <= 0) {
                return res.json({ message: 'erro ao localizar o espaço' })
            }
            if (insertHisReal.length > 0) {
                return res.json({ message: 'espaço localizado com sucesso' })
            }
        } catch (error) {
            console.log('linha 103', error);
        }

        try {
            if (CODIGO_MAQUINA === 'EX002') {
                await connection.query(`UPDATE ESTOQUE SET SALDOREAL = SALDOREAL + (CAST('${qtdBoas}' AS decimal(19, 6))) WHERE 1 = 1 AND CODIGO = '${codigoPeca}'`)
            } else {
                await connection.query(`UPDATE ESTOQUE SET SALDOREAL = SALDOREAL + (CAST('${qtdBoas}' AS decimal(19, 6))) WHERE 1 = 1 AND CODIGO = '${codigoPeca}'`)
            }
        } catch (error) {
            console.log(error);
            return res.json({ message: 'erro ao inserir estoque' })
        }
    } catch (error) {
        console.log('linha 107', error);
        return res.json({ message: 'erro ao localizar os dados em hisreal' })
    }
}