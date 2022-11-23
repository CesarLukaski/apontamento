import { RequestHandler } from "express";
import mssql from "mssql";
import sanitize from "sanitize-html";
import { sqlConfig } from "../../global.config";
import { select } from "../services/select";
import { selectAddress } from "../services/selectAddress";
import { update } from "../services/update";
import { decrypted } from "../utils/decryptedOdf";

export const getPoint: RequestHandler = async (req, res) => {
    const connection = await mssql.connect(sqlConfig);
    let NUMERO_ODF = decrypted(String(sanitize(req.cookies["NUMERO_ODF"]))) || null
    let qtdBoas: number = decrypted(String(sanitize(req.cookies["qtdBoas"]))) || null;
    const NUMERO_OPERACAO = decrypted(String(sanitize(req.cookies['NUMERO_OPERACAO']))) || null
    const CODIGO_MAQUINA = decrypted(String(sanitize(req.cookies['CODIGO_MAQUINA']))) || null
    let codigoPeca = decrypted(String(sanitize(req.cookies['CODIGO_PECA']))) || null
    let funcionario = decrypted(String(sanitize(req.cookies['employee']))) || null
    let qtdProduzir = decrypted(String(sanitize(req.cookies['qtdProduzir']))) || null
    const updateQuery = `UPDATE ESTOQUE SET SALDOREAL = SALDOREAL + (CAST('${qtdBoas}' AS decimal(19, 6))) WHERE 1 = 1 AND CODIGO = '${codigoPeca}'`
    var address;
    const hostname = req.get("host")
    const { networkInterfaces } = require('os');
    const nets = networkInterfaces();
    const results: any = {}; // Or just '{}', an empty object
    for (const name of Object.keys(nets)) {
        for (const net of nets[name]) {
            // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
            if (net.family === 'IPv4' && !net.internal) {
                if (!results[name]) {
                    results[name] = [];
                }
                results[name].push(net.address);
            }
        }
    }
    const ip = String(Object.entries(results)[0]![1])
    try {
        //Caso a operação seja 999 fará baixa no estoque
        console.log("linha 38 /getPoint /", NUMERO_OPERACAO);
        if (NUMERO_OPERACAO === "00999") {
                // Verificar onde é possível alocar essas peças
                // condic === 'M' é peso
                // condic === 'D' é tempo
                // Pra fazer essa conta precisa de condic === "M"
                // Ambos estao na coluna EXECUT
                let y = `SELECT TOP 1 CONDIC, EXECUT, COMPRIMENTO, LARGURA FROM OPERACAO WHERE 1 = 1 AND NUMPEC = '${codigoPeca}' AND CONDIC = 'M'`
                const x = await select(y)

                let pesoUnidade = x[0].EXECUT
                let comprimento = x[0].COMPRIMENTO
                let largura = x[0].LARGURA
                let areaCubicaMax = 36000000
                let areaMax = 800
                let pesoMax = 25

                let peso = pesoUnidade * qtdProduzir
                if (peso < pesoMax) {
                    console.log("Passou no primeiro teste ...");
                }

                let area = comprimento + largura
                if(area <= areaMax){
                    console.log("passou no segundo teste ...");
                }

                let areaCubica = comprimento * largura * qtdProduzir
                if(areaCubica < areaCubicaMax){
                    console.log("passou no terceiro teste ...");
                }


            //Caso seja diferente de "EX"
            if (CODIGO_MAQUINA !== 'EX002') {
                let condicional = `= '${codigoPeca}'`
                let condicional2 = `IS NULL`
                let fisrtSelectAddress: any = await selectAddress(condicional, 5)
                let secondSelectAddress: any;

                if (fisrtSelectAddress === 'odf nao encontrada') {
                    fisrtSelectAddress = []
                    secondSelectAddress = await selectAddress(condicional2, 5)
                }

                if (!secondSelectAddress || secondSelectAddress === 'odf nao encontrada') {
                    secondSelectAddress = []
                }

                let fisrtReqAddress = fisrtSelectAddress.map((callback: any) => callback.QUANTIDADE)
                let secondReqAddress = secondSelectAddress.map((callback: any) => callback.QUANTIDADE)

                let smallerNumber = Math.min(...fisrtReqAddress)
                let small = Math.min(...secondReqAddress)

                let indiceDoArrayDeOdfs: number = fisrtReqAddress.findIndex((callback: any) => callback === smallerNumber)
                let indice: number = secondReqAddress.findIndex((callback: any) => callback === small)

                let addressToStorage = {}

                if (secondSelectAddress.length <= 0) {
                    addressToStorage = {
                        message: 'Address located',
                        address: fisrtSelectAddress[indiceDoArrayDeOdfs].ENDERECO,
                    }
                    address = addressToStorage
                    //return res.json(addressToStorage)
                }

                if (fisrtSelectAddress.length <= 0) {
                    addressToStorage = {
                        message: 'Address located',
                        address: secondSelectAddress[indice].ENDERECO
                    }
                    address = addressToStorage
                    //return res.json(addressToStorage)
                }
            }

            //Caso seja igual de "EX"
            if (CODIGO_MAQUINA === 'EX002') {
                let fisrtSelectAddress: any = await selectAddress(codigoPeca, 7)
                let secondSelectAddress: any;

                if (!fisrtSelectAddress) {
                    fisrtSelectAddress = []
                    secondSelectAddress = await selectAddress(codigoPeca, 7)
                }

                if (!secondSelectAddress) {
                    secondSelectAddress = []
                }

                if (typeof (secondSelectAddress) === 'string') {
                    secondSelectAddress = []
                }
                if (typeof (secondSelectAddress) === 'string') {
                    fisrtSelectAddress = []
                }

                const fisrtAdd = fisrtSelectAddress.map((callback: any) => callback.QUANTIDADE)
                const secondAdd = secondSelectAddress.map((callback: any) => callback.QUANTIDADE)

                let smallerNumber = Math.min(...fisrtAdd)
                let small = Math.min(...secondAdd)

                let indiceDoArrayDeOdfs: number = fisrtAdd.findIndex((callback: any) => callback === smallerNumber)
                let indice: number = secondAdd.findIndex((callback: any) => callback === small)

                let addressToStorage;
                if (secondSelectAddress.length <= 0) {
                    addressToStorage = {
                        message: 'Address located',
                        address: fisrtSelectAddress[indiceDoArrayDeOdfs].ENDERECO,
                    }
                    address = addressToStorage
                    //return res.json(addressToStorage)
                }

                if (fisrtSelectAddress.length <= 0) {
                    addressToStorage = {
                        message: 'Address located',
                        addresss: secondSelectAddress[indice].ENDERECO
                    }
                    address = addressToStorage
                   // return res.json(addressToStorage)
                }
            }
            try {
                const lookForHisReal = `SELECT TOP 1  * FROM HISREAL  WHERE 1 = 1 AND CODIGO = '${codigoPeca}' ORDER BY DATA DESC`
                const resultQuery = await select(lookForHisReal)
                try {
                    const insertHisReal = await connection.query(`
                INSERT INTO HISREAL
                    (CODIGO, DOCUMEN, DTRECEB, QTRECEB, VALPAGO, FORMA, SALDO, DATA, LOTE, USUARIO, ODF, NOTA, LOCAL_ORIGEM, LOCAL_DESTINO, CUSTO_MEDIO, CUSTO_TOTAL, CUSTO_UNITARIO, CATEGORIA, DESCRICAO, EMPRESA_RECNO, ESTORNADO_APT_PRODUCAO, CST_ENDERECO, VERSAOSISTEMA, CST_SISTEMA,CST_HOSTNAME,CST_IP) 
                SELECT 
                    CODIGO, '${NUMERO_ODF}/${codigoPeca}', GETDATE(), ${qtdBoas}, 0 , 'E', ${resultQuery[0].SALDO} + ${qtdBoas}, GETDATE(), '0', '${funcionario}', '${NUMERO_ODF}', '0', '0', '0', 0, 0, 0, '0', 'DESCRI', 1, 'E', '${address}', 1.00, 'APONTAMENTO', '${hostname}', '${ip}'
                FROM ESTOQUE(NOLOCK)
                WHERE 1 = 1 
                AND CODIGO = '${codigoPeca}' 
                GROUP BY CODIGO`).then(result => result.rowsAffected)
                    console.log("LINHA 149", insertHisReal);
                } catch (error) {
                    console.log('linha 151', error);
                    return res.json({ message: 'erro inserir em hisreal' })
                }

                try {
                    let updateStorage;
                    if (NUMERO_OPERACAO === "00999") {
                        updateStorage = await update(updateQuery)
                    }

                    console.log("linha 197 /getPoint.ts/", updateStorage);


                    if(updateStorage === 'Update sucess' && address === 'No address'){
                        console.log("linha 201");
                        return res.json({ message: 'No address' })
                    }

                    let responseObj: any = {
                        address,
                        message: 'Address located'
                    }

                    if (!address) {
                        console.log("linha 210 /getPoint.ts/ ");
                        return res.json({ message: 'No address' })
                    } else {
                        console.log("linha 214 /getPoint.ts/ ");
                        return res.json(responseObj)
                    }
                } catch (error) {
                    console.log(error);
                    return res.json({ message: 'Error on updating storage' })
                }

            } catch (error) {
                console.log(error);
                return res.json({ message: 'Error on locating space' })
            }
        } else {
            return res.json({ message: 'No address' })
        }
    } catch (error) {
        console.log('linha 185', error);
        return res.json({ message: 'Error on locating space' })
    }
}
