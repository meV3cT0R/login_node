const { errorM } = require('../utils/error/genericErrorHandling')
const { jsonM } = require('../utils/messageUtils')
const jwt = require('jsonwebtoken')
const sql = require('mssql')
require('dotenv').config()

const getVerifiedUser = async (req, res, params) => {
  if (!req.userId) {
    throw new Error('User Id not given')
  }
  const user = await sql.query(`select * from users where userId=${req.userId}`)
  if (user.recordset.length == 0) {
    throw new Error('User with given user id not found')
  }
  req.user = user.recordset[0]
  console.log("Verified User : ",req.user);
  return req.user
}

module.exports = { getVerifiedUser }
