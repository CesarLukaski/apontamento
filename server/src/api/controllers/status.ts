import { RequestHandler } from "express";
import sanitize from "sanitize-html";
import { select } from "../services/select";
import { decrypted } from "../utils/decryptedOdf";

export const status: RequestHandler = async (req, res) => {
    const numpec = decrypted(String(sanitize(req.cookies['CODIGO_PECA']))) || null
    const maquina = decrypted(String(sanitize(req.cookies['CODIGO_MAQUINA']))) || null
    const lookForTimer = `SELECT TOP 1 EXECUT FROM OPERACAO WHERE 1 = 1 AND NUMPEC = '${numpec}' AND MAQUIN = '${maquina}' ORDER BY REVISAO DESC`
    try {
        const resource = await select(lookForTimer)
        let tempoRestante = Number(resource[0].EXECUT * Number(decrypted(sanitize(String(req.cookies["qtdLibMax"])))) * 1000 - (Number(new Date().getTime() - decrypted(String(sanitize(req.cookies['startSetupTime'])))))) || 0
        if (tempoRestante > 0) {
            return res.status(200).json(tempoRestante)
        } else if (tempoRestante <= 0) {
            tempoRestante = 0
            return res.json({ message: 'time for execution not found' })
        } else {
            return res.json({ message: 'Algo deu errado' })
        }
    } catch (error) {
        console.log('linha 29 - Status.ts -', error)
        return res.json({ error: true, message: "Erro no servidor." });
    }
}