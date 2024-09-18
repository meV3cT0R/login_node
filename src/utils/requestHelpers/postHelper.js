const client = require('mssql')

function queryGenerator (params, allowed, table_name, config) {
  for (const key of Object.keys(config.foreignKeys)) allowed.push(key)

  let queryP1 = `insert into ${table_name}`
  let queryP2 = '('
  queryP2 += allowed.join(',')
  queryP2 += ')'

  for (const _ in Object.keys(config.foreignKeys)) allowed.pop()

  let queryP3 = ' values('
  for (let i = 0; i < allowed.length; i++) {
    if (typeof params[allowed[i]] == 'string')
      queryP3 += `'${params[allowed[i]]}'`
    else queryP3 += params[allowed[i]]
    if (i != allowed.length - 1) queryP3 += ','
  }

  let queryP4 = ''

  if (config && Object.keys(config.foreignKeys).length != 0) {
    queryP4 += ','
    console.log(config.foreignKeys)
    const oKeys = Object.keys(config.foreignKeys)
    for (let i = 0; i < oKeys.length; i++) {
      let val = config.foreignKeys[oKeys[i]]
      console.log(val)
      if (typeof val =='string' && val.startsWith('body')) {
        val = params[val.split('_').slice(1).join('_')]
      }
      if (typeof val == 'string') {
        queryP4 += `'${val}'`
      } else queryP4 += val
      if (i != oKeys.length - 1) queryP4 += ','
    }
  }

  queryP4 += ')'
  return queryP1 + queryP2 + queryP3 + queryP4
}

function postHelper (req, res, _, allowed, table_name, config) {
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
      let query = queryGenerator(body, allowed, table_name, config)
      console.log(`query generated : ${query}`)
      res.setHeader('Content-Type', 'application/json')
      console.log('Inserting data into db')
      client.query(query, (err, _) => {
        if (err) {
          console.log('Error occured')
          console.log(err)
          res.statusCode = 400
          res.end(
            JSON.stringify({
              message: 'Something went wrong'
            })
          )
          return
        }
        console.log('Data Successfully Inserted')
        res.statusCode = 201
        res.end(
          JSON.stringify({
            message: 'Resource Successfully Created'
          })
        )
      })
    })
}

module.exports = { postHelper }
