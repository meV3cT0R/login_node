const { errorM } = require('../utils/error/genericErrorHandling')
const { jsonM } = require('../utils/messageUtils')
const jwt = require('jsonwebtoken')
const sql = require('mssql')
require('dotenv').config()

const jwtVerifyA = async (req, res, params) => {
  return new Promise((resolve, reject) => {
    const auth = req.headers['Authorization'] || req.headers['authorization']
    console.log('provided auth : ', auth)
    if (!auth) {
      reject('No auth Provided')
      throw new Error('No auth provided')
    }
    const token = auth.split(' ')[1]

    try {
      jwt.verify(token, process.env.SECRET_KEY)
    } catch (err) {
      reject(err)

      throw err
    }

    const decoded = jwt.decode(token)
    console.log(decoded)
    sql.query(
      `select * from users where userId=${decoded.userId} and username='${decoded.username}' and password='${decoded.password}'`,
      (err, result) => {
        if (err) {
          reject(err)
          throw err
        }
        if (result.recordset.length == 0) {
          reject(err)
          throw new Error('User not found')
        }
        
        req.userId = result.recordset[0].userId
        req.role = result.recordset[0].roles
        console.log(req.userId);
        resolve(result.recordset[0].userId)
      }
    )
  })
}

module.exports = { jwtVerifyA }
