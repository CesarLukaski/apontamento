import { sanitize } from "./sanitize";

export function unravelBarcode(barcode: string) {
    barcode = String(sanitize(barcode))
    let response = {
        message: ''
    }

    if (barcode === '' || barcode === undefined || barcode === null) {
        return response.message = 'Algo deu errado'
    }

    //Reatribuiu o codigo caso o cado de barras seja maior
    const dados: any = {
        numOdf: String(barcode!.slice(10)),
        numOper: String(barcode!.slice(0, 5)),
        codMaq: String(barcode!.slice(5, 10)),
    }

    if (barcode!.length > 17) {
        dados.numOdf = barcode!.slice(11)
        dados.numOper = barcode!.slice(0, 5)
        dados.codMaq = barcode!.slice(5, 11)
    }
    return dados
}


