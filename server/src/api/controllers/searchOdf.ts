import type { RequestHandler } from 'express';
import sanitize from 'sanitize-html';
import { select } from '../services/select';
import { selectToKnowIfHasP } from '../services/selectIfHasP';
import { decrypted } from '../utils/decryptedOdf';
import { encoded } from '../utils/encodedOdf';
import { encrypted } from '../utils/encryptOdf';
import { unravelBarcode } from '../utils/unravelBarcode'
import { odfIndex } from '../utils/odfIndex';
import { selectedItensFromOdf } from '../utils/queryGroup';
import { update } from '../services/update';
import { codeNoteMessage } from '../utils/codeNoteMessage';

export const searchOdf: RequestHandler = async (req, res) => {
    const dados: any = unravelBarcode(req.body.barcode)
    let qtdLibMax: number;
    const lookForOdfData = `SELECT REVISAO, NUMERO_ODF, NUMERO_OPERACAO, CODIGO_MAQUINA, QTDE_ODF, QTDE_APONTADA, QTDE_LIB,  QTD_REFUGO, CODIGO_PECA  FROM VW_APP_APTO_PROGRAMACAO_PRODUCAO (NOLOCK) WHERE 1 = 1 AND NUMERO_ODF = ${dados.numOdf} AND CODIGO_PECA IS NOT NULL ORDER BY NUMERO_OPERACAO ASC`

    console.log('linha 18 /searchOdf/', req.body.message);

    // Seleciona todos os itens da Odf
    const groupOdf = await select(lookForOdfData)

    if (!groupOdf) {
        return res.json({ message: 'odf não encontrada' })
    }

    let indexOdf: number = await odfIndex(groupOdf, dados.numOper)

    if (indexOdf === undefined || indexOdf === null) {
        return res.json({ message: 'Algo deu errado' })
    }

    const selectedItens: any = await selectedItensFromOdf(groupOdf, indexOdf)

    console.log('linha 33 /searchOdf/', selectedItens.odf);

    if (indexOdf === 0) {
        qtdLibMax = selectedItens.odf.QTDE_ODF - selectedItens.odf.QTDE_APONTADA
    } else {
        qtdLibMax = selectedItens.beforeOdf.QTDE_APONTADA - selectedItens.odf.QTDE_APONTADA
    }

    if (qtdLibMax === 0) {
        return res.json({ message: 'não há limite na odf' })
    }

    console.log('liha 45', qtdLibMax);

    // Caso seja a primeira Odf, objOdfSelecAnterior vai vir como undefined
    // Tinha o update de 'S' em apontamento liberado

    // let numeroOper = '00' + selectedItens.odf.NUMERO_OPERACAO.replaceAll(' ', '0')

    // Descriptografa o funcionario dos cookies
    let funcionario = decrypted(String(sanitize(req.cookies['employee'])))


    if (!funcionario) {
        console.log("linha 52 /funcionario/", funcionario);
        return res.json({ message: 'Algo deu errado' })
    }

    //Criptografa os dados da ODF
    let qtdLibString: string = encrypted(String(qtdLibMax))
    let encryptedOdfNumber = encrypted(String(selectedItens.odf.NUMERO_ODF))
    const encryptedNextMachine = encrypted(String(selectedItens.nextOdf.CODIGO_MAQUINA))
    const encryptedNextOperation = encrypted(String(selectedItens.nextOdf.NUMERO_OPERACAO))
    const encryptedCodePart = encrypted(String(selectedItens.odf.CODIGO_PECA))
    const encryptedMachineCode = encrypted(String(selectedItens.odf.CODIGO_MAQUINA))
    const operationNumber = encrypted(String(selectedItens.odf.NUMERO_OPERACAO))
    const encryptedRevision = encrypted(String(selectedItens.odf.REVISAO))

    //Codifica os dados da ODF
    const encodedOdfNumber = encoded(String(selectedItens.odf.NUMERO_ODF))
    const encodedOperationNumber = encoded(String(selectedItens.odf.NUMERO_OPERACAO))
    const encodedMachineCode = encoded(String(selectedItens.odf.CODIGO_MAQUINA))

    // Principais cookies para o processo
    res.cookie('NUMERO_ODF', encryptedOdfNumber, { httpOnly: true });
    res.cookie('encodedOdfNumber', encodedOdfNumber, { httpOnly: true })
    res.cookie('encodedOperationNumber', encodedOperationNumber, { httpOnly: true })
    res.cookie('encodedMachineCode', encodedMachineCode, { httpOnly: true })
    res.cookie('MAQUINA_PROXIMA', encryptedNextMachine, { httpOnly: true })
    res.cookie('OPERACAO_PROXIMA', encryptedNextOperation, { httpOnly: true })
    res.cookie('CODIGO_PECA', encryptedCodePart, { httpOnly: true })
    res.cookie('CODIGO_MAQUINA', encryptedMachineCode, { httpOnly: true })
    res.cookie('NUMERO_OPERACAO', operationNumber, { httpOnly: true })
    res.cookie('REVISAO', encryptedRevision, { httpOnly: true })

    let y = await codeNoteMessage(req.body.message)
    console.log('linha 92 /y/', y);
   // let x = await codeNoteMessage(req.body.message)

    let lookForChildComponents = await selectToKnowIfHasP(dados, qtdLibMax, funcionario, selectedItens.odf.NUMERO_OPERACAO, selectedItens.odf.CODIGO_PECA)
    var response = {
        message: '',
        url: '',
    }
    try {
        let y = `UPDATE PCP_PROGRAMACAO_PRODUCAO SET QTDE_LIB = ${lookForChildComponents.quantidade} WHERE 1 = 1 AND NUMERO_ODF = ${dados.numOdf} AND NUMERO_OPERACAO = ${dados.numOper}`
        const x = await update(y)
        console.log('lookForChildComponents.quantidade', lookForChildComponents.quantidade);
        if (x === 'Update sucess') {
            if (lookForChildComponents.quantidade) {
                res.cookie('qtdLibMax', encrypted(String(lookForChildComponents.quantidade)))
            } else {
                res.cookie('qtdLibMax', qtdLibString)
            }

            if (lookForChildComponents!.reserved > qtdLibMax) {
                lookForChildComponents!.reserved = qtdLibMax
            }

            if (lookForChildComponents === 'não é nessa operação que deve ser reservado') {
                return res.json({ message: 'Valores Reservados' })
            }

            if (!lookForChildComponents || lookForChildComponents === 'Quantidade para reserva inválida') {
                return res.json({ message: 'Algo deu errado' })
            }

            if (lookForChildComponents.message === 'Algo deu errado') {
                return res.json({ message: 'Algo deu errado' })
            }

            if (lookForChildComponents.message === 'Valores Reservados') {
                res.cookie('execut', encrypted(String(lookForChildComponents!.execut)))
                res.cookie('reservedItens', encrypted(String(lookForChildComponents!.reserved)))
                res.cookie('codigoFilho', encrypted(String(lookForChildComponents!.codigoFilho)))
                res.cookie('condic', encrypted(String(lookForChildComponents!.condic)))
                res.cookie('quantidade', lookForChildComponents!.quantidade)
                return res.json({ message: 'Valores Reservados' })
            }

            if (lookForChildComponents.message === 'Quantidade para reserva inválida') {
                return res.json({ message: 'Quantidade para reserva inválida' })
            }

            if (lookForChildComponents.message === 'Não há item para reservar') {
                return res.json({ message: 'Valores Reservados' })
            }
            else {
                return res.json({ message: 'Algo deu errado' })
            }
        } else if (x === 'Algo deu errado') {
            console.log('linha 136 /searchOdf/');
            response.message = 'Algo deu errado'
            return response
        } else {
            console.log('linha 140 /searchOdf/');
            response.message = 'Algo deu errado'
            return response
        }
    } catch (error) {
        console.log('linha 145 Error on selectHasP', error);
        response.message = 'Algo deu errado'
        return res.json({ response })
    }
}
