const sql = require('mssql')

const postHelper = async (formTemplate, body, userId) => {
  console.log("post helper", userId);
  try {
    const template = await sql.query(
      `select fieldName,actualName from formTemplate where formTemplate=${formTemplate}`
    )
    const selectData = await sql.query(
      `insert into formTable(formTemplate,createdBy) OUTPUT Inserted.formId values('${formTemplate}',${userId})`
    )
    
    

    console.log(selectData)
    const formTable = selectData.recordset

    const cols = {}
    for (const val of Object.keys(template.recordset)) {
      cols[template.recordset[val].actualName] =
        template.recordset[val].fieldName
    }
    console.log('cols', cols)
    const colObj = {}
    for (const col of Object.keys(cols)) {
      if (body[col]) colObj[cols[col]] = body[col]
    }
    console.log('colObj', colObj)

    const query = `insert into formData(${Object.keys(colObj).join(
      ','
    )},formId,createdBy) 
    OUTPUT Inserted.formDataId
    values(${Object.keys(colObj)
      .map(key => {
        return `'${colObj[key]}'` 
      })
      .join(',')},${formTable[0].formId},${userId})`
    console.log(query)

    const insertedFormDataId = await sql.query(query)
    console.log("Data Inserted",insertedFormDataId);

    const modQuery = `insert into formDataModifiedHistory(${Object.keys(colObj).join(
      ','
    )},formDataId,type,createdBy) values(${Object.keys(colObj)
      .map(key => {
        return `'${colObj[key]}'`
      })
      .join(',')},${insertedFormDataId.recordset[0].formDataId},'insert',${userId})`

    await sql.query(modQuery);
    return formTable[0].formId
  } catch (err) {
    throw err
  }
}

module.exports = { postHelper }
