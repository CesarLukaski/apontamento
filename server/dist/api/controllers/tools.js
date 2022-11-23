"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.selectedTools = exports.tools = void 0;
const pictures_1 = require("../pictures");
const insert_1 = require("../services/insert");
const select_1 = require("../services/select");
const decodeOdf_1 = require("../utils/decodeOdf");
const decryptedOdf_1 = require("../utils/decryptedOdf");
const encryptOdf_1 = require("../utils/encryptOdf");
const sanitize_1 = require("../utils/sanitize");
const tools = async (req, res, next) => {
    if (req.cookies['NUMERO_ODF'] === undefined) {
        return res.json({ message: 'Algo deu errado' });
    }
    let decodedOdfNumber = (0, decodeOdf_1.decodedBuffer)(String((0, sanitize_1.sanitize)(req.cookies['encodedOdfNumber']))) || null;
    let numeroOdf = (0, decryptedOdf_1.decrypted)(String((0, sanitize_1.sanitize)(req.cookies["NUMERO_ODF"]))) || null;
    let codigoPeca = (0, decryptedOdf_1.decrypted)(String((0, sanitize_1.sanitize)(req.cookies["CODIGO_PECA"]))) || null;
    let numeroOperacao = (0, decryptedOdf_1.decrypted)(String((0, sanitize_1.sanitize)(req.cookies["NUMERO_OPERACAO"]))) || null;
    let codigoMaq = (0, decryptedOdf_1.decrypted)(String((0, sanitize_1.sanitize)(req.cookies["CODIGO_MAQUINA"]))) || null;
    let funcionario = (0, decryptedOdf_1.decrypted)(String((0, sanitize_1.sanitize)(req.cookies['employee']))) || null;
    let revisao = (0, decryptedOdf_1.decrypted)(String((0, sanitize_1.sanitize)(req.cookies['REVISAO']))) || null;
    let start = (0, decryptedOdf_1.decrypted)(String((0, sanitize_1.sanitize)(req.cookies["startSetupTime"]))) || null;
    let qtdLibMax = (0, decryptedOdf_1.decrypted)(String((0, sanitize_1.sanitize)(req.cookies['qtdLibMax']))) || null;
    let startTime;
    startTime = Number(start);
    let ferramenta = String("_ferr");
    const boas = 0;
    const ruins = 0;
    const codAponta = 1;
    const descricaoCodigoAponta = 'Ini Setup.';
    const faltante = 0;
    let retrabalhada = 0;
    const motivo = '';
    let lookForTools = `SELECT [CODIGO], [IMAGEM] FROM VIEW_APTO_FERRAMENTAL WHERE 1 = 1 AND IMAGEM IS NOT NULL AND CODIGO = '${codigoPeca}'`;
    if (numeroOdf !== decodedOdfNumber) {
        return res.json({ message: 'Erro na ODF' });
    }
    numeroOdf = Number(numeroOdf);
    qtdLibMax = Number(qtdLibMax);
    try {
        let toolsImg;
        try {
            toolsImg = await (0, select_1.select)(lookForTools);
            await (0, insert_1.insertInto)(funcionario, numeroOdf, codigoPeca, revisao, numeroOperacao, codigoMaq, qtdLibMax, boas, ruins, codAponta, descricaoCodigoAponta, motivo, faltante, retrabalhada, startTime);
        }
        catch (error) {
            console.log(error);
            return res.json({ message: "Erro ao inserir codapontamento 1" });
        }
        if (toolsImg === 'Data not found') {
            return res.json({ message: 'Data not found' });
        }
        let result = [];
        for await (let [i, record] of toolsImg.entries()) {
            const rec = await record;
            const path = await pictures_1.pictures.getPicturePath(rec["CODIGO"], rec["IMAGEM"], ferramenta, String(i));
            result.push(path);
        }
        if (toolsImg.length <= 0) {
            return res.json({ message: "/images/sem_imagem.gif" });
        }
        if (toolsImg.length > 0) {
            console.log("linha 75 /codigo de apontamento 1 inserido ..../");
            res.cookie('tools', 'true');
            let obj = {
                message: 'codeApont 1 inserido',
                result: result,
            };
            return res.json(obj);
        }
        else {
            next();
        }
    }
    catch (error) {
        return res.json({ error: true, message: "Erro ao tentar acessar as fotos de ferramentas" });
    }
};
exports.tools = tools;
const selectedTools = async (req, res) => {
    let numeroOdf = (0, decryptedOdf_1.decrypted)(String((0, sanitize_1.sanitize)(req.cookies['NUMERO_ODF']))) || null;
    numeroOdf = Number(numeroOdf);
    const numeroOperacao = (0, decryptedOdf_1.decrypted)(String((0, sanitize_1.sanitize)(req.cookies['NUMERO_OPERACAO']))) || null;
    const codigoMaq = (0, decryptedOdf_1.decrypted)(String((0, sanitize_1.sanitize)(req.cookies['CODIGO_MAQUINA']))) || null;
    const codigoPeca = (0, decryptedOdf_1.decrypted)(String((0, sanitize_1.sanitize)(req.cookies["CODIGO_PECA"]))) || null;
    const funcionario = (0, decryptedOdf_1.decrypted)(String((0, sanitize_1.sanitize)(req.cookies['employee']))) || null;
    const revisao = (0, decryptedOdf_1.decrypted)(String((0, sanitize_1.sanitize)(req.cookies['REVISAO']))) || null;
    let qtdLibMax = (0, decryptedOdf_1.decrypted)(String((0, sanitize_1.sanitize)(req.cookies['qtdLibMax']))) || null;
    qtdLibMax = Number(qtdLibMax);
    let start = (0, decryptedOdf_1.decrypted)(String((0, sanitize_1.sanitize)(req.cookies['startSetupTime']))) || null;
    const boas = 0;
    const ruins = 0;
    const codAponta = 2;
    const codAponta3 = 3;
    const descricaoCodigoAponta = 'Fin Setup.';
    let descricaoCodigoAponta3 = 'Ini Prod.';
    const faltante = 0;
    let retrabalhada = 0;
    const motivo = String('' || null);
    const end = Number(new Date().getTime()) || 0;
    let startTime;
    startTime = Number(start);
    let tempoDecorrido = String(end - startTime || 0);
    String(tempoDecorrido);
    let startProd = Number(new Date().getTime() || 0);
    start = (0, encryptOdf_1.encrypted)(start);
    res.cookie("startProd", startProd);
    try {
        const codApontamentoFinalSetup = await (0, insert_1.insertInto)(funcionario, numeroOdf, codigoPeca, revisao, numeroOperacao, codigoMaq, qtdLibMax, boas, ruins, codAponta, descricaoCodigoAponta, motivo, faltante, retrabalhada, startProd);
        const codApontamentoInicioSetup = await (0, insert_1.insertInto)(funcionario, numeroOdf, codigoPeca, revisao, numeroOperacao, codigoMaq, qtdLibMax, boas, ruins, codAponta3, descricaoCodigoAponta3, motivo, faltante, retrabalhada, startProd);
        if (codApontamentoInicioSetup === 'Algo deu errado' || codApontamentoFinalSetup === 'Algo deu errado') {
            return res.json({ message: 'Algo deu errado' });
        }
        if (codApontamentoInicioSetup === 'insert done' && codApontamentoFinalSetup === 'insert done') {
            return res.json({ message: 'ferramentas selecionadas com successo' });
        }
        else {
            return res.json({ message: 'Algo deu errado' });
        }
    }
    catch (error) {
        console.log('linha 104 /selected Tools/: ', error);
        return res.json({ message: 'Algo deu errado' });
    }
};
exports.selectedTools = selectedTools;
//# sourceMappingURL=tools.js.map