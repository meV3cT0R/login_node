const client = require('mssql')

function queryGenerator (body, table_name, discard, conditions) {
  let query = `update ${table_name} `
  query += 'set '
  const arr = Object.keys(body)

  for (let i = 0; i < arr.length; i++) {
    if (discard.includes(arr[i])) continue
    query += `${arr[i]} = `
    if (typeof body[arr[i]] == 'string') query += `'${body[arr[i]]}'`
    else query += body[arr[i]]
    if (i != arr.length - 1) query += ','
  }
  query += ` where `

  for (let i = 0; i < conditions.length; i++) {
    query += `${conditions[i]} = '${body[conditions[i]]}'`
    if (i != conditions.length - 1) query += ' and '
  }
  console.log(`Query Built : ${query}`)
  return query
}

function putHelper (
  req,
  res,
  params,
  table_name,
  discard,
  conditions,
  callback
) {
  const func = (body) => {
    query = queryGenerator(body, table_name, discard, conditions)
    client
      .query(query)
      .then(result => {
        console.log('Data Successfully Updated')
        if (callback) {
          console.log('user callback executed')
          callback(req, res, params, result)
          return
        } else {
          console.log('put helper default callback')
          res.statusCode = 200
          res.end(
            JSON.stringify({
              ...result.recordsets
            })
          )
        }
      })
      .catch(err => {
        console.log('Error occured')
        console.log(err)
        res.statusCode = 400
        res.end(
          JSON.stringify({
            message: 'Something went wrong'
          })
        )
        return
      })
  }
  console.log('inside put Helper')
  if (req.body) {
    func(req.body);
    return;
  }
  console.log(req.body)
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
      func(body);
    })
}

module.exports = { putHelper,queryGenerator }
