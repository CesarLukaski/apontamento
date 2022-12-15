import { RequestHandler } from "express";
import { select } from "../services/select";
import { cookieGenerator } from "../utils/cookieGenerator";
import { encrypted } from "../utils/encryptOdf";
import { sanitize } from "../utils/sanitize";

export const searchBagde: RequestHandler = async (req, res) => {
    let matricula = String(sanitize(req.body["badge"])) || null
    let lookForBadge = `SELECT TOP 1 [FUNCIONARIO], [CRACHA] FROM FUNCIONARIOS WHERE 1 = 1 AND [CRACHA] = '${matricula}' ORDER BY FUNCIONARIO`;

    if (!matricula || matricula === '0' || matricula === '00' || matricula === '000' || matricula === '0000' || matricula === '00000' || matricula === '000000') {
        return res.json({ message: "Empty badge" });
    }

    try {
        const selecionarMatricula = await select(lookForBadge)
        if (selecionarMatricula.length <= 0) {
            return res.json({ message: 'Crachá não encontrado' });
        } else if (selecionarMatricula.length >= 0) {
            let startSetupTime = encrypted(String(new Date().getTime()));
            res.cookie('startSetupTime', startSetupTime, { httpOnly: true })
            await cookieGenerator(res, selecionarMatricula[0])
            return res.json({ message: 'Badge found' });
        } else {
            return res.json({ message: 'Crachá não encontrado' });
        }
    } catch (error) {
        console.log(error)
        return res.json({ message: 'Crachá não encontrado' });
    }
}