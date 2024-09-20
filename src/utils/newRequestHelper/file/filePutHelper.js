const sql = require('mssql');
const { queryGenerator } = require('../../requestHelpers/putHelper');
const { filePostHelper } = require('./filePostHelper');

const filePutHelper = async (file,userId,role,formId) => {
  console.log("put file body",file);
  try {
    const query = queryGenerator(
      {
        ...file
      },
      'formFiles',
      ['formId', 'id',"formFileId"],
      ['formFileId']
    )

    // const formDataQuery = `select * from formFiles where formFileId=${file.formFileId}`;
    // console.log("Form Data Query : ",formDataQuery);
    // const formData = await sql.query(formDataQuery)
    if(role=="editor"){
      const formDataResult = await sql.query(`select * from formFiles where formFileId=${file["formFileId"]} `) 
      if(formDataResult.recordset.length ==0) {
        await filePostHelper(formId,[file],userId);
        return;
      }
      if(formDataResult.recordset[0].createdBy!=userId)
        throw new Error("Not Enough Permission");
    }
    await sql.query(query);


    let modQuery = `insert into formFilesModifiedHistory(fileName,fileType,fileData,type,createdBy,formFilesId) values`
       modQuery+=`('${file.fileName}','${file.fileType}','${file.fileData}','update',${userId},${file.formFileId})`
    console.log(modQuery);
    await sql.query(modQuery);
    
    // const modHistoryQuery = `insert into formFilesModHistory(modifiedBy,modifiedAt,modifiedFormFilesId) values(${id},'${new Date().toISOString()}',${
    //     file.formFileId
    //   });`;
    //   console.log("Mod History Query : ", modHistoryQuery);
      
    // await sql.query(
    //   modHistoryQuery
    // )
    // console.log(query)

    // const modHistory = await sql.query(
    //   `select top 1 * from formFilesModHistory order by modifiedAt desc`
    // )

    // let modFieldInsertQuery = `insert into formFilesModifiedFields(formFilesModHistoryId,fieldName,fieldPrevValue,fieldNewValue) values`

    // let i = 0
    // delete file["formId"]
    // delete file["formFileId"]
    // for (const col of Object.keys(file)) {
    //   modFieldInsertQuery += `(${modHistory.recordset[0]["formFilesModHistoryId"]},'${col}','${formData.recordset[0][col]}','${file[col]}')`
    //   if (i < Object.keys(file).length - 1) modFieldInsertQuery += ','
    //   i++
    // }
    // console.log("modified field insert query : ",modFieldInsertQuery)
    // await sql.query(modFieldInsertQuery)
    return
  } catch (err) {
    throw new Error(err)
  }
}

module.exports = { filePutHelper }
