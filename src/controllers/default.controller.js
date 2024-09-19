const sql = require('mssql')
const jwt = require('jsonwebtoken')
const { errorM } = require('../utils/error/genericErrorHandling')
const { jsonM } = require('../utils/messageUtils')
const { postHelper } = require('../utils/newRequestHelper/postHelper')
const { bodyParser } = require('../middlewares/bodyParser')

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
    `Select * from formData where charField7='${decoded_data.username}' and charField8='${decoded_data.password}'`,
    (err, result) => {
      if (err) {
        errorM(res, err)
        return
      }
      if (result.recordset.length == 0) {
        jsonM(res, 403, 'jwt malformed')
        return
      }
      sql.query(
        'select actualName,fieldName from formTemplate where formTemplate=2',
        (err, templateResult) => {
          const colObj = {}
          for (const val of templateResult.recordset) {
            if (result.recordset[0][val.fieldName])
              colObj[val.actualName] = result.recordset[0][val.fieldName]
          }
          delete colObj['password']


          res.end(
            JSON.stringify({
              message: 'Welcome to secure endpoint :D',
              data: {
                ...colObj

              }
            })
          )
        }
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
        `select * from formData where charField7='${body.username}' and charField8='${body.pwd}'`,
        (err, result) => {
          if (err) {
            res.statusCode = 500
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
          sql.query(
            'select actualName,fieldName from formTemplate where formTemplate=2',
            (err, templateResult) => {
              const colObj = {}
              for (const val of templateResult.recordset) {
                if (result.recordset[0][val.fieldName])
                  colObj[val.actualName] = result.recordset[0][val.fieldName]
              }
              console.log(colObj)
              res.statusCode = 200
              jwt.sign(
                {
                  ...colObj
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
        }
      )
    })
}

const signup = async (req, res, params) => {
  res.setHeader('Content-Type', 'application/json')
  try {
    await bodyParser(req, res, params)
    await postHelper(2, req.body)
    jsonM(res, 200, 'Resource Successfully Created')
  } catch (err) {
    jsonM(res, 500, err)
    throw err
  }
}
module.exports = { secure_endpoint, login, signup }
