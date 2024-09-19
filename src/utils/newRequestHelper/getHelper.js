const sql = require('mssql')

const getHelper = async formTemplate => {
  try {
    const template = await sql.query(
      `select fieldName,actualName from formTemplate where formTemplate=${formTemplate}`
    )
    const forms = await sql.query(
      `select * from formTable where deletedAt is null and formTemplate=${formTemplate};`
    )

    console.log('Template', template.recordset)
    const cols = template.recordset.map(val => val.fieldName)
    const colObj = {}
    for (const val of template.recordset) {
      colObj[val.fieldName] = val.actualName
    }

    console.log(cols)

    const data = []
    for (const val of forms.recordset) {
      console.log(val)
      const query = `select ${cols.join(',')} from formData where formId = ${
        val.formId
      }`

      console.log(query)
      const d = await sql.query(query)
      console.log(d.recordset[0])
      const tempData = {}

      for (const col of cols) {
        tempData[colObj[col]] = d.recordset[0][col]
      }
      data.push(tempData)
    }
    console.log("Here's your data " , data);
    return data
  } catch (err) {
    throw err
  }
}

module.exports = { getHelper }
