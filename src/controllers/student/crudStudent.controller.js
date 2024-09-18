const { jwtVerify } = require('../../middlewares/jwtVerify')
const { errorM } = require('../../utils/error/genericErrorHandling')
const { jsonM } = require('../../utils/messageUtils')
const sql = require('mssql')
const { getHelper } = require('../../utils/requestHelpers/getHelper')
const { postHelper } = require('../../utils/requestHelpers/postHelper')

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
            faculty : "body_faculty"
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

module.exports = { createStudent, getAllStudent, getAllFaculty }
