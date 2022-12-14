"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.returnedValue = void 0;
const insert_1 = require("../services/insert");
const select_1 = require("../services/select");
const update_1 = require("../services/update");
const decryptedOdf_1 = require("../utils/decryptedOdf");
const sanitize_1 = require("../utils/sanitize");
const unravelBarcode_1 = require("../utils/unravelBarcode");
const returnedValue = async (req, res) => {
    const choosenOption = Number((0, sanitize_1.sanitize)(req.body["quantity"])) || 0;
    const supervisor = (0, sanitize_1.sanitize)(req.body["supervisor"]) || null;
    const returnValues = String((0, sanitize_1.sanitize)(req.body['returnValueStorage'])) || null;
    if (!returnValues) {
        return res.json({ message: 'Não foi indicado boas e ruins' });
    }
    const funcionario = (0, decryptedOdf_1.decrypted)(String((0, sanitize_1.sanitize)(req.cookies['employee']))) || null;
    const barcode = (0, sanitize_1.sanitize)(req.body["barcodeReturn"]) || null;
    const lookForSupervisor = `SELECT TOP 1 CRACHA FROM VIEW_GRUPO_APT WHERE 1 = 1 AND CRACHA = '${supervisor}'`;
    let boas;
    let ruins;
    const codAponta = 8;
    let descricaoCodigoAponta = "";
    let motivo = ``;
    let tempoDecorrido = 0;
    var response = {
        message: '',
    };
    if (!funcionario) {
        return res.json({ message: 'odf não encontrada' });
    }
    if (!barcode && !choosenOption && !supervisor || supervisor === "undefined") {
        return res.json({ message: "odf não encontrada" });
    }
    if (!barcode || barcode === 'undefined' || barcode === '') {
        return res.json({ message: "codigo de barras vazio" });
    }
    if (!supervisor || supervisor === "undefined" || supervisor === '') {
        return res.json({ message: "supervisor esta vazio" });
    }
    if (!choosenOption) {
        return res.json({ message: "quantidade esta vazio" });
    }
    if (returnValues === 'BOAS') {
        boas = choosenOption;
    }
    if (returnValues === 'RUINS') {
        ruins = choosenOption;
    }
    if (!boas) {
        boas = 0;
    }
    if (!ruins) {
        ruins = 0;
    }
    const dados = await (0, unravelBarcode_1.unravelBarcode)(barcode);
    const lookForOdfData = `SELECT * FROM VW_APP_APTO_PROGRAMACAO_PRODUCAO (NOLOCK) WHERE 1 = 1 AND NUMERO_ODF = ${dados.numOdf} AND CODIGO_PECA IS NOT NULL ORDER BY NUMERO_OPERACAO ASC`;
    const resourceOdfData = await (0, select_1.select)(lookForOdfData);
    let quantityPointedbefore = resourceOdfData.map((element) => element.QTDE_APONTADA);
    let index = quantityPointedbefore.findIndex((value) => value === 0);
    if (index < 0) {
        index = resourceOdfData.length;
    }
    console.log('linha 72', index);
    let availableToReturn = resourceOdfData[index - 1];
    console.log('linha 73', availableToReturn);
    if (!availableToReturn) {
        availableToReturn = resourceOdfData[index];
    }
    let valorTotal = boas + ruins;
    console.log('linha 74', dados.numOper);
    console.log('linha 75', "00" + availableToReturn.NUMERO_OPERACAO.replaceAll(' ', '0'));
    if (availableToReturn.QTDE_APONTADA <= 0) {
        return res.json({ message: "não ha valor que possa ser devolvido" });
    }
    else if ("00" + availableToReturn.NUMERO_OPERACAO.replaceAll(' ', '0') !== dados.numOper) {
        response.message = 'Essa não pode ser estornada';
        return res.json(response);
    }
    else if (!availableToReturn.QTD_REFUGO && ruins > 0) {
        console.log('linha 79');
        response.message = 'Refugo Inválido';
        return res.json(response);
    }
    else if (availableToReturn.QTDE_APONTADA < valorTotal) {
        console.log('linha 84');
        response.message = 'Valor acima';
        return res.json(response);
    }
    else if (availableToReturn.QTDE_APONTADA <= 0) {
        console.log('linha 88');
        response.message = 'Não há o que estornar';
        return res.json(response);
    }
    else {
        console.log('linha 92');
        let codigoPeca = String(availableToReturn.CODIGO_PECA);
        let revisao = String(availableToReturn.REVISAO);
        let qtdOdf = Number(availableToReturn.QTDE_ODF) || 0;
        let qtdApontOdf = Number(availableToReturn.QTDE_APONTADA) || 0;
        let faltante = Number(0);
        let retrabalhada = Number(0);
        let qtdLibMax = qtdOdf - qtdApontOdf;
        if (availableToReturn.QTDE_APONTADA <= 0) {
            qtdLibMax = 0;
        }
        if (qtdLibMax <= 0) {
            return res.json({ message: "não ha valor que possa ser devolvido" });
        }
        const selectSuper = await (0, select_1.select)(lookForSupervisor);
        if (selectSuper.length > 0) {
            try {
                const insertHisCodReturned = await (0, insert_1.insertInto)(funcionario, dados.numOdf, codigoPeca, revisao, dados.numOper, dados.codMaq, qtdLibMax, boas, ruins, codAponta, descricaoCodigoAponta, motivo, faltante, retrabalhada, tempoDecorrido);
                if (insertHisCodReturned === 'insert done') {
                    const updateQuery = `UPDATE PCP_PROGRAMACAO_PRODUCAO SET QTDE_APONTADA = QTDE_APONTADA - '${valorTotal}', QTD_REFUGO = QTD_REFUGO - ${ruins} WHERE 1 = 1 AND NUMERO_ODF = '${dados.numOdf}' AND CAST (LTRIM(NUMERO_OPERACAO) AS INT) = '${dados.numOper}' AND CODIGO_MAQUINA = '${dados.codMaq}'`;
                    const updateValuesOnPcp = await (0, update_1.update)(updateQuery);
                    if (updateValuesOnPcp === 'Update sucess') {
                        return res.status(200).json({ message: 'estorno feito' });
                    }
                    else {
                        return res.json({ message: 'erro de estorno' });
                    }
                }
                else {
                    return res.json({ message: 'erro de estorno' });
                }
            }
            catch (error) {
                console.log(error);
                return res.json({ message: 'erro de estorno' });
            }
        }
        else {
            return res.json({ message: 'erro de estorno' });
        }
    }
};
exports.returnedValue = returnedValue;
//# sourceMappingURL=returnedValue.js.map