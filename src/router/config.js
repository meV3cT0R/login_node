const { editUser, changePassword } = require('../controllers/crudUser.controller')
const { secure_endpoint, login, signup } = require('../controllers/default.controller')


const routeConfig = {
  post: {
    login: login,
    signup : signup,
    edit : editUser,
    change_password : changePassword
  },
  get: {
    secure_endpoint: secure_endpoint
  }
}

module.exports = { routeConfig }
  