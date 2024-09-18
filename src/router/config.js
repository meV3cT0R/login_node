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
  getAllFaculty
} = require('../controllers/student/crudStudent.controller')


const routeConfig = {
  post: {
    login: login,
    signup: signup,
    edit: editUser,
    change_password: changePassword,
    'students/create': createStudent
  },
  get: {
    secure_endpoint: secure_endpoint,
    students: getAllStudent,
    faculty: getAllFaculty
  }
}

module.exports = { routeConfig }
