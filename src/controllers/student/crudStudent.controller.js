const { jwtVerify } = require('../../middlewares/jwtVerify')
const { errorM } = require('../../utils/error/genericErrorHandling')
const { jsonM } = require('../../utils/messageUtils')
const sql = require('mssql')
const { getHelper } = require('../../utils/requestHelpers/getHelper')
const { postHelper } = require('../../utils/requestHelpers/postHelper')
const { putHelper } = require('../../utils/requestHelpers/putHelper')
const { dateYMD } = require('../../utils/date/dateYMD')
const { bodyParser } = require('../../middlewares/bodyParser')

const TABLE_NAME = 'students'

const createStudent = (req, res, params) => {
  try {
    jwtVerify(req, res, params, (req, res, params) => {
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
          'joinedOn',
          'rollNo',
          'currentYear',
          'image',
          'address',
          'country',
          'city'
        ],
        TABLE_NAME,
        {
          defaultValues: {},
          foreignKeys: {
            createdBy: req.userId,
            faculty: 'body_faculty'
          }
        }
      )
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

const getAllFaculty = (req, res, params) => {
  console.log('Inside getAllFaculty()')

  res.setHeader('Content-Type', 'application/json')

  getHelper(
    req,
    res,
    params,
    {
      startStr: `select * from Faculty`,
      endStr: ''
    },
    'id',
    []
  )
}

const updateStudent = (req, res, params) => {
  console.log('Inside update Student()')
  try {
    jwtVerify(req, res, params, (req, res, params) => {
      res.setHeader('Content-Type', 'application/json')
      bodyParser(req, res, params).then(_ => {
        const body = req.body
        sql
          .query(`select * from students where id=${body.id}`)
          .then(result => {
            console.log("got student by given id ",result.recordset[0])
            if (result.recordset.length == 0) {
              jsonM(res, 400, 'Student with given id not found')
              return
            }

            const resultStudentWithGivenId = result.recordset[0]

            const modifiedFields = {}

            console.log("body from body parser",body);
            for (const key of Object.keys(body)) {
              modifiedFields[key] = {
                prevVAlue: resultStudentWithGivenId[key],
                newValue: body[key]
              }
            }
            console.log("All modified Fields", modifiedFields)
            putHelper(req, res, params, TABLE_NAME, ['id'], ['id'], (req,res,params,result) => {
              console.log('update completed')
              sql
                .query(
                  `insert into modHistory(modifiedBy,modifiedAt,modifiedStudent) values(${
                    req.userId
                  },'${dateYMD(new Date())}',${body.id})`
                )
                .then(result => {
                  console.log('updated mod history table for student update')
                  sql
                    .query(
                      `select top 1 * from modHistory where modifiedStudent=${body.id} order by modifiedAt desc`
                    )
                    .then(resultModHistory => {
                      let query =
                        'insert into  modifiedFields(modHistoryId,fieldName,fieldPrevValue,fieldNewValue) values'
                      const oKeys = Object.keys(modifiedFields);
                      console.log("Modified Field Keys ",oKeys);
                      console.log(resultModHistory)
                      for(let i=0;i<oKeys.length;i++) {
                        query += `(${resultModHistory.recordset[0].id},'${oKeys[i]}','${modifiedFields[oKeys[i]].prevVAlue}','${modifiedFields[oKeys[i]].newValue}')`;
                        if(i!=oKeys.length-1) query +=","
                      }
                      query+=";";
                      sql.query(query).then(_=>{

                        jsonM(res, 200, 'User Sucessfully Updated')
                      }).catch(err=>{
                          jsonM(res,500,err.message || err);
                          throw err;
                      })
                    })
                })
                .catch(err => {
                  console.log(err)
                })
            })
          })
          .catch(err => {
            jsonM(res, 500, 'Something Went wrong')
            throw  err;

          })
      })
    })
  } catch (err) {
    jsonM(res, 400, err)
  }
}

const deleteStudent = (req, res, params) => {
  console.log('Inside deleteStudent()')
  try {
    jwtVerify(req, res, params, (req, res, params) => {
      res.setHeader('Content-Type', 'application/json')
      bodyParser(req, res, params).then(_ => {
        sql
          .query(
            `update ${TABLE_NAME} set deletedBy=${
              req.userId
            }, deletedAt='${dateYMD(new Date())}' where id =${req.body.id}`
          )
          .then(result => {
            jsonM(res, 204, 'Resource Successfully Deleted')
          })
          .catch(err => {
            console.log(err)
          })
      })
    })
  } catch (err) {
    jsonM(res, 400, err)
  }
}

module.exports = {
  createStudent,
  getAllStudent,
  getAllFaculty,
  updateStudent,
  deleteStudent
}
