function jsonM(res,code,message) {
    res.statusCode = code,
    res.end(JSON.stringify({
        message
    }))
}

function jsonJ(res,code,json) {
    res.statusCode = code,
    res.end(JSON.stringify(json))
}
module.exports = {jsonM,jsonJ}