const {
  editUser,
  changePassword
} = require('../controllers/crudUser.controller')
const {
  secure_endpoint,
  login,
  signup
} = require('../controllers/default.controller')
const {
  createStudent,
  getAllStudent,
  getAllFaculty,
  updateStudent,
  deleteStudent
} = require('../controllers/student/crudStudent.controller')
const ncs = require('../controllers/student/newCrudStudent')

const routeConfig = {
  post: {
    login: login,
    signup: signup,
    edit: editUser,
    change_password: changePassword,
    'students/create': ncs.createStudent
  },
  get: {
    secure_endpoint: secure_endpoint,
    students: ncs.getAllStudents,
    faculty: ncs.getAllFaculty
  },
  delete: {
    'students/delete': ncs.deleteStudent
  },
  put: {
    'students/update': ncs.updateStudent
  }
}

module.exports = { routeConfig }
