function jsonM(res,code,message) {
    res.statusCode = code,
    res.end(JSON.stringify({
        message
    }))
}
module.exports = {jsonM}