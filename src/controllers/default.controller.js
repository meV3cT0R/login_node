const sql = require('mssql')
const jwt = require('jsonwebtoken')
const { errorM } = require('../utils/error/genericErrorHandling')
const { jsonM } = require('../utils/messageUtils')
const { bodyParser } = require('../middlewares/bodyParser')
const {
  filePostHelper
} = require('../utils/newRequestHelper/file/filePostHelper')
const { postHelper } = require('../utils/requestHelpers/postHelper')

require('dotenv').config()

const secure_endpoint = (req, res, params) => {
  console.log('on secure end point')
  res.setHeader('Content-Type', 'application/json')

  const auth = req.headers['Authorization'] || req.headers['authorization']
  console.log(`checking authorization header : ${auth}`)
  if (!auth) {
    res.statusCode = 401
    res.end(
      JSON.stringify({
        message: 'unauthorized'
      })
    )
    return
  }
  console.log('verifying jwt')
  const token = auth.split(' ')[1]
  console.log(token)
  try {
    jwt.verify(token, process.env.SECRET_KEY)
  } catch (err) {
    console.log(err)
    res.statusCode = 403
    res.end(
      JSON.stringify({
        message: err.message || err
      })
    )
    return
  }

  const decoded_data = jwt.decode(token)
  sql.query(
    `Select * from users where username='${decoded_data.username}' and password='${decoded_data.password}'`,
    (err, result) => {
      if (err) {
        errorM(res, err)
        return
      }
      if (result.recordset.length == 0) {
        jsonM(res, 403, 'jwt malformed')
        return
      }
      delete result.recordset[0]["password"]
      res.end(
        JSON.stringify({
          message: 'Welcome to secure endpoint :D',
          data: {
            ...result.recordset[0],
          }
        })
      )
    }
  )
}

const login = (req, res, params) => {
  res.setHeader('Content-Type', 'application/json')

  let body = []
  req
    .on('data', chunk => {
      body.push(chunk)
      console.log('Parsing Request Body')
    })
    .on('end', () => {
      body = JSON.parse(Buffer.concat(body).toString())
      console.log('body : ', body)
      sql.query(
        `select * from users where username='${body.username}' and password='${body.password}'`,
        (err, result) => {
          if (err) {
            res.statusCode = 400
            if (err instanceof Error) {
              res.end(
                JSON.stringify({
                  message: err.message
                })
              )
              return
            }
            res.end(
              JSON.stringify({
                message: err
              })
            )
          }
          if (result.recordset.length == 0) {
            res.statusCode = 400
            res.end(
              JSON.stringify({
                message: 'username or password invalid'
              })
            )
            return
          }
          console.log(result.recordset)
          
          res.statusCode = 200
          delete result.recordset[0]["avatar"]
          jwt.sign(
            {
              ...result.recordset[0]
            },
            process.env.SECRET_KEY,
            (err, token) => {
              res.end(
                JSON.stringify({
                  message: 'Login Success',
                  token: token
                })
              )
            }
          )
        }
      )
    })
}

const signup = async (req, res, params) => {
  res.setHeader('Content-Type', 'application/json')
  postHelper(
    req,
    res,
    params,
    [
      'firstName',
      'lastName',
      'gender',
      'email',
      'phone',
      'dob',
      'username',
      'password',
      'avatar',
      'address'
    ],
    'users'
  )
}
module.exports = { secure_endpoint, login, signup }
