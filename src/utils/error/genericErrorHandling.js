const { jsonM } = require("../messageUtils");

function errorM(res,err) {
    if(err instanceof Error) jsonM(res,500,err.message);
    else jsonM(res,500,err);
    return;
}

module.exports = {errorM}
