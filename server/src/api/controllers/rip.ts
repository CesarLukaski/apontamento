import { RequestHandler } from "express";
import sanitize from "sanitize-html";
import { insertInto } from "../services/insert";
import { select } from "../services/select";
import { decrypted } from "../utils/decryptedOdf";

export const rip: RequestHandler = async (req, res) => {
    const numpec: string = decrypted(String(sanitize(req.cookies["CODIGO_PECA"]))) || null
    const revisao: string = decrypted(String(sanitize(req.cookies['REVISAO']))) || null
    const codMaq: string = decrypted(String(sanitize(req.cookies['CODIGO_MAQUINA']))) || null
    console.log('linha codmaqs', codMaq);
    const codigoPeca: string = decrypted(String(sanitize(req.cookies["CODIGO_PECA"]))) || null
    const numeroOdf: number = decrypted(String(sanitize(req.cookies["NUMERO_ODF"]))) || null
    const numeroOperacao: string = decrypted(String(sanitize(req.cookies["NUMERO_OPERACAO"]))) || null
    const funcionario: string = decrypted(String(sanitize(req.cookies['employee']))) || null
    const start: string = decrypted(String(sanitize(req.cookies["startSetupTime"]))) || null
    const qtdLibMax: number = decrypted(String(sanitize(req.cookies['qtdLibMax']))) || null
    const startTime: number = Number(new Date(start).getTime()) || 0
    const response = {
        message: '',
        url: '',
        object: '',
    }
    const rip = `
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
        WHERE PROCESSO.NUMPEC = '${numpec}' 
        AND PROCESSO.REVISAO = '${revisao}' 
        AND CST_NUMOPE = '${codMaq}'
        AND NUMCAR < '2999'
        ORDER BY NUMPEC ASC`
    const ripDetails = await select(rip)

    console.log("linha ripDetaisl", ripDetails);

    if(ripDetails.length <= 0){
        console.log("iewniureb");
        response.message = 'N??o h?? rip a mostrar'
        response.url = '/#/codigobarras'
        return res.json(response)
    }

    let arrayNumope = ripDetails.map((acc: { CST_NUMOPE: string; }) => {
        if (acc.CST_NUMOPE === codMaq) {
            return acc
        } else {
            return acc
        }
    })

    let numopeFilter = arrayNumope.filter((acc: any) => acc)
    res.cookie('cstNumope', numopeFilter.map((acc: { CST_NUMOPE: string; }) => acc.CST_NUMOPE))
    res.cookie('numCar', numopeFilter.map((acc: { NUMCAR: any; }) => acc.NUMCAR))
    res.cookie('descricao', numopeFilter.map((acc: { DESCRICAO: any; }) => acc.DESCRICAO))
    res.cookie('especif', numopeFilter.map((acc: { ESPECIF: any; }) => acc.ESPECIF))
    res.cookie('instrumento', numopeFilter.map((acc: { INSTRUMENTO: any; }) => acc.INSTRUMENTO))
    res.cookie('lie', numopeFilter.map((acc: { LIE: any; }) => acc.LIE))
    res.cookie('lse', numopeFilter.map((acc: { LSE: any; }) => acc.LSE))

    const descricaoCodAponta = `Rip Ini`
    const boas = 0
    const ruins = 0
    const faltante = 0
    const retrabalhada = 0
    const codAponta = 5
    const motivo = ``

    try {
        const inserted = await insertInto(funcionario, numeroOdf, codigoPeca, revisao, numeroOperacao, codMaq, qtdLibMax, boas, ruins, codAponta, descricaoCodAponta, motivo, faltante, retrabalhada, startTime)
        if (inserted === 'insert done') {
            return res.json(numopeFilter)
        } else if (inserted === 'Algo deu errado') {
            return response.message = 'Algo deu errado'
        } else {
            return response.message = 'Algo deu errado'
        }
    } catch (error) {
        response.url = '/#/codigobarras/'
        response.message = 'Erro ao iniciar tempo da rip'
        return res.json(response)
    }

}