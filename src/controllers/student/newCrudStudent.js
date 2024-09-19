const sql = require('mssql')
const { jsonM, jsonJ } = require('../../utils/messageUtils')
const { getHelper } = require('../../utils/newRequestHelper/getHelper')
const { bodyParser } = require('../../middlewares/bodyParser')
const { postHelper } = require('../../utils/newRequestHelper/postHelper')

const formTemplate = 1

const getAllStudents = async (req, res, params) => {
  res.setHeader('Content-Type', 'application/json')
  try {
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
    await postHelper(formTemplate,req.body)
    jsonM(res, 200, 'Resource Successfully Created')
  } catch (err) {
    jsonM(res, 500, err)
    throw err
  }
}

const updateStudent = async (req,res,params)=> {
  res.setHeader('Content-Type', 'application/json')
  
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
module.exports = { getAllStudents, getAllFaculty, createStudent }
