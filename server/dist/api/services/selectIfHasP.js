"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.selectToKnowIfHasP = void 0;
const select_1 = require("./select");
const mssql_1 = __importDefault(require("mssql"));
const global_config_1 = require("../../global.config");
const selectToKnowIfHasP = async (dados, quantidadeOdf, funcionario, numeroOperacao, codigoPeca) => {
    const connection = await mssql_1.default.connect(global_config_1.sqlConfig);
    let response = {
        message: '',
        quantidade: quantidadeOdf,
        url: '',
        codigoFilho: [],
        condic: '',
    };
    try {
        const queryStorageFund = `SELECT DISTINCT                 
        OP.NUMITE,
        OP.NUMSEQ,
        CAST(LTRIM(OP.NUMOPE) AS INT) AS NUMOPE,
               CAST(OP.EXECUT AS INT) AS EXECUT,
               CONDIC,       
               CAST(E.SALDOREAL AS INT) AS SALDOREAL,                 
               CAST(((E.SALDOREAL - ISNULL((SELECT ISNULL(SUM(QUANTIDADE),0) FROM CST_ALOCACAO CA (NOLOCK) WHERE CA.CODIGO_FILHO = E.CODIGO AND CA.ODF = PCP.NUMERO_ODF),0)) / ISNULL(OP.EXECUT,0)) AS INT) AS QTD_LIBERADA_PRODUZIR,
               ISNULL((SELECT ISNULL(SUM(QUANTIDADE),0) FROM CST_ALOCACAO CA (NOLOCK) WHERE CA.CODIGO_FILHO = E.CODIGO),0) as saldo_alocado
               FROM PROCESSO PRO (NOLOCK)                  
               INNER JOIN OPERACAO OP (NOLOCK) ON OP.RECNO_PROCESSO = PRO.R_E_C_N_O_                  
               INNER JOIN ESTOQUE E (NOLOCK) ON E.CODIGO = OP.NUMITE                
               INNER JOIN PCP_PROGRAMACAO_PRODUCAO PCP (NOLOCK) ON PCP.CODIGO_PECA = OP.NUMPEC                
               WHERE 1=1                    
               AND PRO.ATIVO ='S'                   
               AND PRO.CONCLUIDO ='T'                
               AND OP.CONDIC ='P'                 
               AND PCP.NUMERO_ODF = '${dados.numOdf}'
               AND OP.NUMSEQ = ${numeroOperacao}`;
        const selectKnowHasP = await (0, select_1.select)(queryStorageFund);
        console.log("linha 39 /selectKnowHasP/ ", selectKnowHasP);
        if (selectKnowHasP.length > 0) {
            const qtdLibProd = selectKnowHasP.map((element) => element.QTD_LIBERADA_PRODUZIR);
            const numberOfQtd = Math.min(...qtdLibProd);
            response.quantidade = numberOfQtd;
            const codigoFilho = selectKnowHasP.map((item) => item.NUMITE);
            const updateStorageQuery = [];
            let updateAlocacaoQuery = [];
            const insertAlocaoQuery = [];
            response.condic = selectKnowHasP[0].CONDIC;
            response.codigoFilho = codigoFilho;
            let quantityToPoint;
            let x = String(numeroOperacao.replaceAll(' ', ''));
            let makeReservation = selectKnowHasP.map((item) => item.NUMSEQ).filter((element) => element === x);
            if (makeReservation.length <= 0) {
                response.message = 'Algo deu errado';
                return response;
            }
            if (numberOfQtd <= 0) {
                response.message = 'Quantidade para reserva inválida';
                return response;
            }
            console.log('linha 74 /SelectHasP - numberOfQtd/', numberOfQtd);
            console.log("linha 75 /selectHasP/quantidade", quantidadeOdf);
            if (quantidadeOdf < numberOfQtd) {
                response.quantidade = quantidadeOdf;
                quantityToPoint = quantidadeOdf;
            }
            else {
                response.quantidade = numberOfQtd;
                quantityToPoint = numberOfQtd;
            }
            response.quantidade;
            console.log('linha 83', quantityToPoint);
            try {
                codigoFilho.forEach((element) => {
                    updateStorageQuery.push(`UPDATE ESTOQUE SET SALDOREAL = SALDOREAL - ${quantityToPoint} WHERE 1 = 1 AND CODIGO = '${element}'`);
                });
                let updateStorage = Math.min(...await connection.query(updateStorageQuery.join('\n')).then(result => result.rowsAffected));
                if (updateStorage > 0) {
                    try {
                        codigoFilho.forEach((codigoFilho) => {
                            updateAlocacaoQuery.push(`UPDATE CST_ALOCACAO SET QUANTIDADE = QUANTIDADE + ${quantityToPoint} WHERE 1 = 1 AND ODF = '${dados.numOdf}' AND CODIGO_FILHO = '${codigoFilho}'`);
                        });
                        const updateAlocacao = Math.min(...await connection.query(updateAlocacaoQuery.join('\n')).then(result => result.rowsAffected));
                        if (updateAlocacao === 0) {
                            try {
                                if (makeReservation) {
                                    codigoFilho.forEach((codigoFilho) => {
                                        insertAlocaoQuery.push(`INSERT INTO CST_ALOCACAO (ODF, NUMOPE, CODIGO, CODIGO_FILHO, QUANTIDADE, ENDERECO, ALOCADO, DATAHORA, USUARIO) VALUES (${dados.numOdf}, ${numeroOperacao}, '${codigoPeca}', '${codigoFilho}', ${quantityToPoint}, 'ADDRESS', NULL, GETDATE(), '${funcionario}')`);
                                    });
                                    const insertAlocacao = Math.min(...await connection.query(insertAlocaoQuery.join('\n')).then(result => result.rowsAffected));
                                    if (insertAlocacao <= 0) {
                                        response.message = 'Algo deu errado';
                                        return response;
                                    }
                                    else {
                                        console.log("linha 103", insertAlocacao);
                                        response.message = 'Valores Reservados';
                                        response.url = '/#/ferramenta';
                                        return response;
                                    }
                                }
                            }
                            catch (error) {
                                console.log("linha 129 /selectHasP/", error);
                                response.message = 'Algo deu errado';
                                return response;
                            }
                        }
                        else {
                            console.log("linha 134 /selectHasP/");
                            response.message = 'Valores Reservados';
                            response.url = '/#/ferramenta';
                            return response;
                        }
                    }
                    catch (error) {
                        console.log("linha 138 /selectHasp/", error);
                        response.message = 'Algo deu errado';
                        return response;
                    }
                }
                else {
                    response.message = 'Algo deu errado';
                    return response;
                }
            }
            catch (error) {
                console.log("linha 145 /selectHasP/", error);
                response.message = 'Algo deu errado';
                return response;
            }
        }
        else if (selectKnowHasP.length <= 0) {
            response.message = "Não há item para reservar";
            return response;
        }
        else {
            response.message = "Algo deu errado";
            return response;
        }
    }
    catch (error) {
        console.log('linha 154 /error: selectHasP/: ', error);
        return response.message = "Algo deu errado";
    }
};
exports.selectToKnowIfHasP = selectToKnowIfHasP;
//# sourceMappingURL=selectIfHasP.js.map