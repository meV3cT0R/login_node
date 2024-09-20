const sql = require('mssql')

const filePostHelper = async (formId,files,userId) => {
    try {
        if(files.length==0) throw new Error("No Files to Work On");
        let query = `insert into formFiles(fileName,fileType,fileData,formId,createdBy) OUTPUT Inserted.formFileId values`
        for(let i =0;i<files.length;i++){
            query+=`('${files[0].fileName}','${files[0].fileType}','${files[0].fileData}',${formId},${userId})`
            if(i!=files.length-1) query+=","
        }
        console.log(query);
        const insertQuery = await sql.query(query)

        let modQuery = `insert into formFilesModifiedHistory(fileName,fileType,fileData,type,createdBy,formFilesId) values`
        for(let i =0;i<files.length;i++){
            modQuery+=`('${files[0].fileName}','${files[0].fileType}','${files[0].fileData}','insert',${userId},${insertQuery.recordset[0].formFileId})`
            if(i!=files.length-1) query+=","
        }
        console.log(modQuery);
        await sql.query(modQuery);
    }catch(err) {
        console.error(err);
        throw err
    }
}

module.exports = { filePostHelper }
