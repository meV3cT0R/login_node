const { jwtVerify } = require('../../middlewares/jwtVerify')
const { errorM } = require('../../utils/error/genericErrorHandling')
const { jsonM } = require('../../utils/messageUtils')
const sql = require('mssql');
const { getHelper } = require('../../utils/requestHelpers/getHelper');

const TABLE_NAME="students";

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
          const query = `insert into students(first_name,last_name,gender,email,phone,dob,faculty,college_name,college_year,image,address,country,city) values('${body.first_name}','${body.last_name}','${body.gender}','${body.email}','${body.phone}','${body.dob}','${body.faculty}','${body.college_name}','${body.college_year}','${body.image}','${body.address}','${body.country}','${body.city}')`

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

const getAllStudent = (req, res, params) => {
  console.log('Inside getAllStudent()')
  try {
    jwtVerify(req, res, params, (req, res, params) => {
      res.setHeader('Content-Type', 'application/json')

      getHelper(
        req,
        res,
        params,
        {
          startStr: `select * from ${TABLE_NAME}`,
          endStr: ''
        },
        'id',
        []
      )
    })
  } catch (err) {
    jsonM(res, 400, 'Something went wrong')
  }
}
module.exports = { createStudent, getAllStudent }
