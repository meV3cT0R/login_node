const sql = require('mssql')
const deleteHelper = async (id,role) => {
  try {
    if (!id) throw new Error('No id provided')

    if (role == 'editor') {
      const formDataResult = await sql.query(
        `select * from formTable where formId=${file['id']} `
      )
      if (formDataResult.recordset[0].createdBy != userId)
        throw new Error('Not Enough Permission')
    }
    await sql.query(
      `update formTable set deletedAt='${new Date().toISOString()}' where formId=${id}`
    )
    await sql.query(
      `update formData set deletedAt='${new Date().toISOString()}' where formId=${id}`
    )
    await sql.query(
      `update formFiles set deletedAt='${new Date().toISOString()}' where formId=${id}`
    )
  } catch (err) {
    throw err
  }
}

module.exports = { deleteHelper }
