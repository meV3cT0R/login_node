const { secure_endpoint, login, signup } = require('../controllers/default.controller')


const routeConfig = {
  post: {
    login: login,
    signup : signup,
  },
  get: {
    secure_endpoint: secure_endpoint
  }
}

module.exports = { routeConfig }
  