const sql = require('mssql')
const { errorM } = require('../utils/error/genericErrorHandling')
const { jsonM } = require('../utils/messageUtils')
const jwt = require('jsonwebtoken')
const { putHelper } = require('../utils/newRequestHelper/putHelper')
const {
  filePutHelper
} = require('../utils/newRequestHelper/file/filePutHelper')
const { bodyParser } = require('../middlewares/bodyParser')
const { jwtVerifyA } = require('../middlewares/jwtVerifyA')
const { queryGenerator } = require('../utils/requestHelpers/putHelper')
const { verifyEditor } = require('../middlewares/verifyEditor')

const editUser = async (req, res, params) => {
  res.setHeader('Content-Type', 'application/json')
  try {
    await bodyParser(req, res, params)
    await jwtVerifyA(req, res, params)
    const query = queryGenerator(req.body, 'users', ['userId'], ['userId'])

    const userId = req.body['userId']
    delete req.body['userId']

    const modQuery = `insert into usersModifiedHistory(${Object.keys(
      req.body
    ).join(',')},userId) values(${Object.keys(req.body)
      .map(key => {
        return `'${req.body[key]}'`
      })
      .join(',')},${userId})`

    await sql.query(query);
    await sql.query(modQuery);
    jsonM(res, 200, 'Resource Updated Successfully')
  } catch (err) {
    jsonM(res, 500, err)
    throw err
  }
}

const changePassword = (req, res, params) => {
  res.setHeader('Content-Type', 'application/json')
  let body = []
  console.log('Editing user data')
  const auth = req.headers['Authorization'] || req.headers['authorization']
  console.log('token', auth)
  if (!auth) {
    jsonM(res, 401, 'unauthorized')
    return
  }

  req
    .on('data', chunk => {
      body.push(chunk)
    })
    .on('end', () => {
      body = JSON.parse(Buffer.concat(body).toString())
      console.log('[editUser.js] body :', body)
      const decoded_data = jwt.decode(auth.split(' ')[1])
      sql.query(
        `select * from users where username='${decoded_data.username}' and pwd='${body.current_password}'`,
        function (err, result) {
          if (err) {
            errorM(res, err)
            return
          }
          if (result.recordset.length == 0) {
            jsonM(res, 401, 'invalid current password')
            return
          }

          sql.query(
            `update users set pwd = '${decoded_data.new_password}' where id=${decoded_data.id}`,
            (err, result) => {
              if (err) {
                errorM(res, err)
                return
              }
              jsonM(res, 200, 'Password successfully updated')
            }
          )
        }
      )
    })
}
module.exports = { editUser, changePassword }
