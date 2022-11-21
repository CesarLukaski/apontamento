import { RequestHandler } from "express";
import sanitize from "sanitize-html";
import { insertInto } from "../services/insert";
import { select } from "../services/select";
import { decrypted } from "../utils/decryptedOdf";

export const stopSupervisor: RequestHandler = async (req, res) => {
    let supervisor: string = decrypted(String(sanitize(req.body['superSuperMaqPar']))) || null
    let numeroOdf: number = decrypted(String(sanitize(req.cookies['NUMERO_ODF']))) || null
    let NUMERO_OPERACAO: string = decrypted(String(sanitize(req.cookies['NUMERO_OPERACAO']))) || null
    let CODIGO_MAQUINA: string = decrypted(String(sanitize(req.cookies['CODIGO_MAQUINA']))) || null
    let qtdLibMax: number = decrypted(String(sanitize(req.cookies['qtdLibMax']))) || null
    let funcionario: string = decrypted(String(sanitize(req.cookies['FUNCIONARIO']))) || null
    let revisao: string = decrypted(String(sanitize(req.cookies['REVISAO']))) || null
    let codigoPeca: string = decrypted(String(sanitize(req.cookies['CODIGO_PECA']))) || null
    try {
        let boas = 0
        let faltante = 0
        let retrabalhada = 0
        let ruins = 0
        let codAponta = 3
        let descricaoCodAponta = `Ini Prod.`
        let motivo = ''
        let tempoDecorrido = 0
        // const resource = await connection.query(`
        // SELECT TOP 1 CRACHA FROM VIEW_GRUPO_APT WHERE 1 = 1 AND CRACHA = '${supervisor}'`)
        // .then(result => result.recordset);

        let lookForSupervisor = `SELECT TOP 1 CRACHA FROM VIEW_GRUPO_APT WHERE 1 = 1 AND CRACHA = '${supervisor}'`
        const resource = await select(lookForSupervisor)
        console.log("linha 31 /stopSupervisor/", resource);

        if (resource.length > 0) {
            // await connection.query(`
            // INSERT INTO HISAPONTA (DATAHORA, USUARIO, ODF, PECA, REVISAO, NUMOPE, NUMSEQ,  CONDIC, ITEM, QTD, PC_BOAS, PC_REFUGA, ID_APONTA, LOTE, CODAPONTA, CAMPO1, CAMPO2,  TEMPO_SETUP, APT_TEMPO_OPERACAO, EMPRESA_RECNO, CST_PC_FALTANTE, CST_QTD_RETRABALHADA)
            // VALUES(GETDATE(), '${funcionario}' , '${numeroOdf}' , '${codigoPeca}' , '${revisao}' , '${NUMERO_OPERACAO}' ,'${NUMERO_OPERACAO}', 'D', '${CODIGO_MAQUINA}' , '${qtdLibMax}' , '0' , '0' , '${funcionario}' , '0' , '3' , '3', 'Fin Prod.' , '0' , '0' , '1' ,'0','0')`)
            await insertInto(funcionario, numeroOdf, codigoPeca, revisao, NUMERO_OPERACAO, CODIGO_MAQUINA, qtdLibMax, boas, ruins, codAponta, descricaoCodAponta, motivo, faltante, retrabalhada, tempoDecorrido)
            return res.status(200).json({ message: 'maquina' })
        } else {
            return res.json({ message: "supervisor não encontrado" })
        }
    } catch (error) {
        return res.json({ message: "erro na parada de maquina" })
    } finally {
        //await connection.close()
    }
}