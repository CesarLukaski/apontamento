"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cookieCleaner = void 0;
const cookieCleaner = async (res) => {
    [
        'NUMERO_ODF',
        'NUMERO_OPERACAO',
        'qtdBoas',
        'startSetupTime',
        'MAQUINA_PROXIMA',
        'OPERACAO_PROXIMA',
        'codigoFilho',
        'execut',
        'condic',
        'startRip',
        'encodedOperationNumber',
        'numCar',
        'lie',
        'lse',
        'QTDE_LIB',
        'CODIGO_PECA',
        'REVISAO',
        'descricao',
        'instrumento',
        'startProd',
        'especif',
        'employee',
        'CODIGO_MAQUINA',
        'encodedMachineCode',
        'cstNumope',
        'encodedOdfNumber',
        'badge',
        'DBSYNC_DATE',
        'TEMPO_APTO_TOTAL',
        'DT_INI_KORP',
        'HORA_FIM',
        'HORA_INICIO',
        'CST_REPROJETADO',
        'CST_ATUALIZADO',
        'DBSYNC_CDC',
        'R_E_C_N_O_',
        'APONTAMENTO_LIBERADO',
        'QTDE_ODF',
        'DT_FIM_OP',
        'CST_DESENHO',
        'DT_FIM_KORP',
        'EMPRESA_RECNO',
        'CODIGO_CLIENTE',
        'DT_ENTREGA_ODF',
        'QTDE_APONTADA',
        'QTD_REFUGO',
        'DT_INICIO_OP',
        'DATA_ENTREGA_PEDIDO',
        'CRACHA',
        'FUNCIONARIO',
        'quantidade',
        'url',
        'message'
    ].forEach(cookie => {
        res.clearCookie(`${cookie}`);
    });
};
exports.cookieCleaner = cookieCleaner;
//# sourceMappingURL=clearCookie.js.map