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
const { verifyEditor } = require('../../middlewares/verifyEditor')
const { UnauthorizedError } = require('../../middlewares/errors/UnAuthorizedError')
const { getVerifiedUser } = require('../../middlewares/getVerifiedUser')

const formTemplate = 1

const getAllStudents = async (req, res, params) => {
  res.setHeader('Content-Type', 'application/json')
  try {
    await jwtVerifyA(req, res, params)
    const user = await getVerifiedUser(req,res,params);
    console.log("Returned Verified User : ",user);
    const data = await getHelper(formTemplate, params, user)
    console.log("Returned Verified User after get Helper: ",user);

    jsonJ(res, 200, data)
  } catch (err) {
    jsonM(res, 500, err)
  }
}

const createStudent = async (req, res, params) => {
  res.setHeader('Content-Type', 'application/json')
  try {
    await bodyParser(req, res, params)
    await jwtVerifyA(req, res, params)
    await verifyEditor(req)
    const formId = await postHelper(formTemplate, req.body, req.userId)
    if (req.body.file) await filePostHelper(formId,[req.body.file], req.userId)
    jsonM(res, 200, 'Resource Successfully Created')
  } catch (err) {
    console.log(err);
    
    if(err instanceof UnauthorizedError){
      jsonM(res, 401, err.message)
    }else 
      jsonM(res, 500, err)

  }
}

const updateStudent = async (req, res, params) => {
  res.setHeader('Content-Type', 'application/json')
  try {
    await bodyParser(req, res, params)
    await jwtVerifyA(req, res, params)
    await verifyEditor(req)

    req.body['userId'] = req.userId
    await putHelper(1, req.body, req.userId,req.role)
    console.log('body file', req.body.file)
    if (req.body.file.formFileId) {
      console.log('formId', req.body.file.formFileId)
      await filePutHelper(req.body.file, req.userId,req.role,req.body.id)
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
    console.error(err);
    jsonM(res, 500, err)
  }
}

const deleteStudent = async (req, res, params) => {
  res.setHeader('Content-Type', 'application/json')
  try {
    await bodyParser(req, res, params)
    await jwtVerifyA(req, res, params)
    console.log("req.role",req.role);
    await verifyEditor(req)
    console.log("req.body.id",req.body.id);
    await deleteHelper(req.body.id,req.role,req.userId)
    jsonM(res, 200, 'Resource Deleted Successfully')
  } catch (err) {
    console.error(err);
    if(err instanceof UnauthorizedError){
      jsonM(res, 401, err.message)
    }else 
      jsonM(res, 500, err)
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
