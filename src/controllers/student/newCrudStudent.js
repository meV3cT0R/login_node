const sql = require('mssql')
const { jsonM, jsonJ } = require('../../utils/messageUtils')
const { getHelper } = require('../../utils/newRequestHelper/getHelper')
const { bodyParser } = require('../../middlewares/bodyParser')
const { postHelper } = require('../../utils/newRequestHelper/postHelper')
const { deleteHelper } = require('../../utils/newRequestHelper/deleteHelper')
const { jwtVerifyA } = require('../../middlewares/jwtVerifyA')
const { putHelper } = require('../../utils/newRequestHelper/putHelper')

const formTemplate = 1

const getAllStudents = async (req, res, params) => {
  res.setHeader('Content-Type', 'application/json')
  try {
    await jwtVerifyA(req,res,params);
    const data = await getHelper(formTemplate)
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
    await jwtVerifyA(req,res,params);
    await postHelper(formTemplate, req.body)
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
    await jwtVerifyA(req,res,params);
    req.body["userId"] = req.userId
    putHelper(1,req.body,"formDataModHistory","formDataModifiedFields","formDataModHistoryId")
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
    await jwtVerifyA(req,res,params);
    deleteHelper(req.body.id)
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
