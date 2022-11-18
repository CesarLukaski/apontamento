import mssql from 'mssql';
import { sqlConfig } from '../../global.config'

export const select = async (table: string, top: string, column: string, where: string, orderBy: string) => {
    const connection = await mssql.connect(sqlConfig);
    let response: any = {}
    const data = await connection.query(`
    SELECT
    ${top}
    ${column}
    FROM 
    ${table}
    WHERE 1 = 1
    ${where}
    ${orderBy}
    `).then((result) => result.recordset)

    if (data.length <= 0) {
        return response.message = "odf nao encontrada"
    }

    if (data.length >= 0) {
        return response.data = data
    } else {
        return response.message = 'Algo deu errado'
    }
}