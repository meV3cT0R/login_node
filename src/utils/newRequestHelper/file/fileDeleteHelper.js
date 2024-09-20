const sql = require('mssql')

const fileDeleteHelper = async (id) => {
    try {
        let query = `update  formFiles set deletedAt='${(new Date()).toISOString()}' where formId=${id}`
        await sql.query(query)
    }catch(err) {
        console.error(err);
        throw err
    }
}

module.exports = { fileDeleteHelper }
