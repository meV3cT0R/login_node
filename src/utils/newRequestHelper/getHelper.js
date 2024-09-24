const sql = require('mssql')
const { filterHelper } = require('../filterHelper')


const getHelper = async (formTemplate,params={},user) => {
  try {
    const template = await sql.query(
      `select fieldName,actualName from formTemplate where formTemplate=${formTemplate}`
    )
    // const forms = await sql.query(
    //   `select * from formTable where deletedAt is null and formTemplate=${formTemplate};`
    // )

    console.log('Template', template.recordset)
    const cols = template.recordset.map(val => val.fieldName)
    // const colObj = {}
    // for (const val of template.recordset) {
    //   colObj[val.fieldName] = val.actualName
    // }

    // console.log(cols)

    const data = []

    let query = `select formDataId,formData.formId${cols.length!=0? ",":" "}${cols.join(',')} from formData inner join formTable on formData.formId=formTable.formId where formTable.formTemplate=${formTemplate} and formData.deletedAt is null `
    console.log("User inside getHelper",user);
    if(user && user.roles=="editor") {
      console.log("Is a Editor")
      query += `and formTable.createdBy = ${user.userId} `
    }
    console.log("Simple Query  :",query)

    const filteredQuery = filterHelper(query,"",params,"formData.formId",false)
    console.log("Filtered Query : ", filteredQuery);
    const result = await sql.query(filteredQuery);
    
    for(const val of result.recordset) {
      const record  = {
        formId : val.formId,
        id : val.formDataId
      };
      for(const temp of template.recordset){
        if(val[temp.fieldName])
          record[temp.actualName] = val[temp.fieldName]
      }
      console.log("value from result.recordset",val)
      const fileQuery = `select * from formFiles where formId = ${val.formId}`;
      console.log("File query",fileQuery);
      const files = await sql.query(fileQuery)
      record["files"] = files.recordset
      data.push(record);
    }
    
    // for (const val of forms.recordset) {
    //   console.log(val)
    //   const query = `select  from formData where formId = ${
    //     val.formId
    //   }`

    //   console.log(query)
    //   const d = await sql.query(query)
    //   console.log(d.recordset[0])
    //   const files = await sql.query(`select * from formFiles where formId = ${val.formId}`)
    //   const tempData = {
    //     id : val.formId
    //   }

    //   for (const col of cols) {
    //     if(d.recordset[0] && d.recordset[0][col])
    //       tempData[colObj[col]] = d.recordset[0][col]
    //   }
    //   tempData["files"] = files.recordset
    //   data.push(tempData)
    // }
    // console.log("Here's your data " , data);
    return data
  } catch (err) {
    throw err
  }
}

module.exports = { getHelper }
