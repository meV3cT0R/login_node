const bodyParser = async (req, res, params) => {
  return new Promise((resolve, reject) => {
    let body = []
    req
      .on('data', chunk => {
        body.push(chunk)
        console.log('Parsing Request Body')
      })
      .on('end', () => {
        body = JSON.parse(Buffer.concat(body).toString())
        console.log('Request Body Parsed')
        console.log(body)
        req.body=body
        resolve();
      })
  })
}

module.exports = { bodyParser }
