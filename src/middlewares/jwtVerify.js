const { errorM } = require("../utils/error/genericErrorHandling");
const { jsonM } = require("../utils/messageUtils");
const jwt = require("jsonwebtoken");
const sql = require("mssql");
require("dotenv").config();

const jwtVerify = (req,res,params,next) => {
    const auth = req.headers["Authorization"] || req.headers["authorization"];
    console.log("provided auth : " , auth);
    if(!auth) {
        throw new Error("No auth provided");
    }
    const token = auth.split(" ")[1];

    try {
        jwt.verify(token,process.env.SECRET_KEY);
    }catch(err) {
        throw err
    }

    const decoded = jwt.decode(token);
    console.log(decoded);
    sql.query(`select * from users where userId=${decoded.userId} and username='${decoded.username}' and pwd='${decoded.pwd}'`,(err,result)=> {
        if(err){
            throw err;
        }
        if(result.recordset.length==0) {
            jsonM(res,401,"Unauthorized")
            return;
        }
        req.userId=decoded.userId;
        next(req,res,params)
    })
}

module.exports = { jwtVerify } 