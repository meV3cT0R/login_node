const { queryGenerator } = require("../requestHelpers/putHelper")
const sql = require('mssql')

const putHelper = async (formTemplate,body,modHistoryTableName,modifiedFieldsTableName,modHistoryIdName) => {
  console.log("put body",body);
  try {
    const template = await sql.query(
      `select actualName,fieldName from formTemplate where formTemplate=${formTemplate}`
    )

    const colObj = {}

    for (const val of template.recordset) {
      if (body[val.actualName]) colObj[val.fieldName] = body[val.actualName]
    }

    const query = queryGenerator(
      {
        formId: body['id'],
        ...colObj
      },
      'formData',
      ['formId', 'id'],
      ['formId']
    )
    const formData = await sql.query(
      `select * from formData where formId=${body.id}`
    )

    await sql.query(query);


    await sql.query(
      `insert into ${modHistoryTableName}(modifiedBy,modifiedAt,modifiedFormDataId) values(${body["userId"]},'${new Date().toISOString()}',${
        formData.recordset[0]['formDataId']
      });`
    )
    console.log(query)

    const modHistory = await sql.query(
      `select top 1 * from ${modHistoryTableName} order by modifiedAt desc`
    )

    let modFieldInsertQuery = `insert into ${modifiedFieldsTableName}(${modHistoryIdName},fieldName,fieldPrevValue,fieldNewValue) values`

    let i = 0
    for (const col of Object.keys(colObj)) {
      modFieldInsertQuery += `(${modHistory.recordset[0][modHistoryIdName]},'${col}','${formData.recordset[0][col]}','${colObj[col]}')`
      if (i < Object.keys(colObj).length - 1) modFieldInsertQuery += ','
      i++
    }
    console.log(modFieldInsertQuery)
    await sql.query(modFieldInsertQuery)
    return
  } catch (err) {
    throw new Error(err)
  }
}

module.exports = { putHelper }
