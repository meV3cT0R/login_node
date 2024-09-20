const { queryGenerator } = require("../requestHelpers/putHelper")
const sql = require('mssql')

const putHelper = async (formTemplate,body,userId) => {
  console.log("put body",body);
  try {

    const template = await sql.query(
      `select fieldName,actualName from formTemplate where formTemplate=${formTemplate}`
    )
    const selectData = await sql.query(
      `insert into formTable(formTemplate) OUTPUT Inserted.formId values('${formTemplate}')`
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

    await sql.query(query);

    const modQuery = `insert into formDataModifiedHistory(${Object.keys(colObj).join(
      ','
    )},formDataId,type,createdBy) values(${Object.keys(colObj)
      .map(key => {
        return `'${colObj[key]}'`
      })
      .join(',')},${body['id']},'update',${userId})`

      await sql.query(modQuery);


    //@@@ used to get the value before updating the value in the database
    // to store the  previous value in modHistory and modHistoryFields table
    // const formData = await sql.query(
    //   `select * from formData where formId=${body.id}`
    // )

    

    //@@@ store the value in modhistory table
    // await sql.query(
    //   `insert into ${modHistoryTableName}(modifiedBy,modifiedAt,modifiedFormDataId) values(${body["userId"]},'${new Date().toISOString()}',${
    //     formData.recordset[0]['formDataId']
    //   });`
    // )
    console.log(query)
    
    //@@@ used to get the most recently added value 
    //@@@ used to get the value we just inserted to retrieve it's id
    //@@@@ we could simply use OUTPUT Inserted.ID to retrieve the id in single statement
    // const modHistory = await sql.query(
    //   `select top 1 * from ${modHistoryTableName} order by modifiedAt desc`
    // )

    //@@@ store all the modified field with prev value and new value in modifiedFieldsTable
    // let modFieldInsertQuery = `insert into ${modifiedFieldsTableName}(${modHistoryIdName},fieldName,fieldPrevValue,fieldNewValue) values`

    // let i = 0
    // for (const col of Object.keys(colObj)) {
    //   modFieldInsertQuery += `(${modHistory.recordset[0][modHistoryIdName]},'${col}','${formData.recordset[0][col]}','${colObj[col]}')`
    //   if (i < Object.keys(colObj).length - 1) modFieldInsertQuery += ','
    //   i++
    // }
    // console.log(modFieldInsertQuery)
    // await sql.query(modFieldInsertQuery)


    return
  } catch (err) {
    throw new Error(err)
  }
}

module.exports = { putHelper }
