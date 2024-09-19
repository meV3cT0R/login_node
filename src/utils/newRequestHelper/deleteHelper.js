const sql = require('mssql')
const deleteHelper = async id => {
  try {
    if (!id) throw new Error('No id provided')
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
