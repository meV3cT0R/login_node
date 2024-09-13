const { jwtVerify } = require('../../middlewares/jwtVerify')
const { errorM } = require('../../utils/error/genericErrorHandling')
const { jsonM } = require('../../utils/messageUtils')
const sql = require('mssql')

const createStudent = (req, res, params) => {
  try {
    jwtVerify(req, res, params, (req, res, params) => {
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
          const query = `insert into students(first_name,last_name,gender,email,phone) values('${body.first_name}','${body.last_name}','${body.gender}','${body.email}','${body.phone}')`
          sql.query(query, (err, result) => {
            if (err) {
              return errorM(res, err)
            }
            console.log(result)
            jsonM(res, 201, 'Resource Successfully created')
          })
        })
    })
  } catch (err) {
    jsonM(res, 400, 'Something went wrong')
  }
}

module.exports = { createStudent }
