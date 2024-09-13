const sql = require('mssql')
const jwt = require('jsonwebtoken')
const { errorM } = require('../utils/error/genericErrorHandling')
const { jsonM } = require('../utils/messageUtils')

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
  res.end(
    JSON.stringify({
      message: 'Welcome to secure endpoint :D'
    })
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
      console.log("body : ",body);
      sql.query(
        `select * from users where username='${body.username}' and pwd='${body.pwd}'`,
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
          res.statusCode = 200
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

const signup = (req, res, params) => {
  res.setHeader('Content-Type', 'application/json')

  let body = []
  req
    .on('data', chunk => {
      body.push(chunk)
      console.log('Parsing Request Body')
    })
    .on('end', () => {
      body = JSON.parse(Buffer.concat(body).toString())
      console.log("body : " ,body);
      sql.query(
        `select * from users where username='${body.username}'`,
        (err, result) => {
          if(err){
            return errorM(res,err);
          }
          console.log("selec query : ",result);
          if(result.recordset.length >0) {
            jsonM(res,400,`user with ${body.username} already exists`);
            return
          }
          const query = `insert into users(first_name,last_name,gender,phone,pwd,username) values('${body.first_name}','${body.last_name}','${body.gender}','${body.phone}','${body.pwd}','${body.username}')`

          sql.query(query, (err, result) => {
            if(err){
              return errorM(res,err);
            }
            console.log(result)
            jsonM(res, 201, 'Resource Successfully created')
          })
        }
      )
    })
}
module.exports = { secure_endpoint, login, signup }
