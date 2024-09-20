const sql = require('mssql')
const { jsonM, jsonJ } = require('../../utils/messageUtils')
const { getHelper } = require('../../utils/newRequestHelper/getHelper')
const { bodyParser } = require('../../middlewares/bodyParser')
const { postHelper } = require('../../utils/newRequestHelper/postHelper')
const { deleteHelper } = require('../../utils/newRequestHelper/deleteHelper')
const { jwtVerifyA } = require('../../middlewares/jwtVerifyA')
const { putHelper } = require('../../utils/newRequestHelper/putHelper')
const {
  filePostHelper
} = require('../../utils/newRequestHelper/file/filePostHelper')
const {
  fileDeleteHelper
} = require('../../utils/newRequestHelper/file/fileDeleteHelper')
const {
  filePutHelper
} = require('../../utils/newRequestHelper/file/filePutHelper')

const formTemplate = 1

const getAllStudents = async (req, res, params) => {
  res.setHeader('Content-Type', 'application/json')
  try {
    await jwtVerifyA(req, res, params)
    const data = await getHelper(formTemplate, params)
    jsonJ(res, 200, data)
  } catch (err) {
    jsonM(res, 500, err)
    throw err
  }
}

const createStudent = async (req, res, params) => {
  res.setHeader('Content-Type', 'application/json')
  try {
    await bodyParser(req, res, params)
    await jwtVerifyA(req, res, params)
    const formId = await postHelper(formTemplate, req.body, req.userId)
    if (req.body.file) await filePostHelper(formId,[req.body.file], req.userId)
    jsonM(res, 200, 'Resource Successfully Created')
  } catch (err) {
    jsonM(res, 500, err)
    throw err
  }
}

const updateStudent = async (req, res, params) => {
  res.setHeader('Content-Type', 'application/json')
  try {
    await bodyParser(req, res, params)
    await jwtVerifyA(req, res, params)
    req.body['userId'] = req.userId
    await putHelper(1, req.body, req.userId)
    console.log('body file', req.body.file)
    if (req.body.file.formFileId) {
      console.log('formId', req.body.file.formFileId)
      await filePutHelper(req.body.file, req.userId)
    } else {
      if (req.body.file) {
        console.log('Student Update')
        console.log('Creating new File')
        await filePostHelper(req.body.id, [req.body.file])
        console.log('Created New File')
      }
    }

    jsonM(res, 200, 'Resource Updated Successfully')
  } catch (err) {
    jsonM(res, 500, err)
    throw err
  }
}

const deleteStudent = async (req, res, params) => {
  res.setHeader('Content-Type', 'application/json')
  try {
    await bodyParser(req, res, params)
    await jwtVerifyA(req, res, params)
    console.log("req.body.id",req.body.id);
    await deleteHelper(req.body.id)
    jsonM(res, 200, 'Resource Deleted Successfully')
  } catch (err) {
    jsonM(res, 500, err)
    throw err
  }
}

const getAllFaculty = async (req, res, params) => {
  res.setHeader('Content-Type', 'application/json')
  try {
    const data = await getHelper(3)
    jsonJ(res, 200, data)
  } catch (err) {
    jsonM(res, 500, err)
    throw err
  }
}
module.exports = {
  getAllStudents,
  getAllFaculty,
  createStudent,
  deleteStudent,
  updateStudent
}
