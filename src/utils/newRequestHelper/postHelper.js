const sql = require('mssql')

const postHelper = async (formTemplate,body) => {
  try {
    const template = await sql.query(
      `select fieldName,actualName from formTemplate where formTemplate=${formTemplate}`
    )
    await sql.query(
      `insert into formTable(formTemplate) values('${formTemplate}')`
    )
    const selectData = await sql.query(
      `select top 1 * from formTable order by createdAt desc;`
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
    )},formId) values(${Object.keys(colObj)
      .map(key => {
        return `'${colObj[key]}'`
      })
      .join(',')},${formTable[0].formId})`
    console.log(query)
    await sql.query(query)
    return;
  } catch (err) {
    throw err
  }
}

module.exports = { postHelper }
