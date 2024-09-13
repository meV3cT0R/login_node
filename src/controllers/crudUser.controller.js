const sql = require('mssql')
const { errorM } = require('../utils/error/genericErrorHandling')
const { jsonM } = require('../utils/messageUtils')
const jwt = require("jsonwebtoken");
const editUser = (req, res, params) => {
  res.setHeader('Content-Type', 'application/json')
  let body = []
  console.log('Editing user data')
  req
    .on('data', chunk => {
      body.push(chunk)
    })
    .on('end', () => {
      body = JSON.parse(Buffer.concat(body).toString())
      console.log('[editUser.js] body :', body)

      sql.query(
        `update users set first_name='${body.first_name}',last_name='${body.last_name}',username='${body.username}',gender='${body.gender}',phone='${body.phone}' where id=${body.id}`,
        function (err, result) {
          console.log('Edit result', result)
          if (err) {
            errorM(res, err)
            return
          }
          jsonM(res, 200, 'User Successfully updated')
        }
      )
    })
}

const changePassword = (req, res, params) => {
  res.setHeader('Content-Type', 'application/json')
  let body = []
  console.log('Editing user data')
  const auth = req.headers['Authorization'] || req.headers['authorization']
  console.log("token", auth);
  if(!auth) {
    jsonM(res,401,"unauthorized");
    return;
  }

  req
    .on('data', chunk => {
      body.push(chunk)
    })
    .on('end', () => {
      body = JSON.parse(Buffer.concat(body).toString())
      console.log('[editUser.js] body :', body)
        const decoded_data = jwt.decode(auth.split(" ")[1]);
        sql.query(`select * from users where username='${decoded_data.username}' and pwd='${body.current_password}'`,function(err,result) {
            if(err){
                errorM(res,err);
                return;
            }
            if(result.recordset.length==0) {
                jsonM(res,401,"invalid current password");
                return;
            }

            sql.query(`update users set pwd = '${decoded_data.new_password}' where id=${decoded_data.id}`,(err,result)=>{
                if(err){
                    errorM(res,err);
                    return;
                }
                jsonM(res,200,"Password successfully updated");
          })
        })
     
    })
}
module.exports = { editUser,changePassword }
