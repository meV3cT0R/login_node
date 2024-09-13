const http = require('http')
const { sqlConfig } = require('./src/db/config')
const { route } = require('./src/router/route')
const sql = require('mssql')
;(async () => {
  try {
    await sql.connect(sqlConfig)
    console.log('Connected to Sql server')
  } catch (err) {
    if (err instanceof Error) {
      throw err
    } else console.log(err)
    process.exit(0)
  }

  const host = 'localhost'
  const port = '8080'

  const server = http.createServer((req, res) => {
    if (!req.url.startsWith('/api/v1')) {
      res.statusCode = 200
      res.setHeader('Content-Type', 'application/json')
      res.end(
        JSON.stringify({
          message: 'Hello World'
        })
      )
      return
    }
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', '*')
    res.setHeader('Access-Control-Allow-Headers', '*')
    if (req.method === 'OPTIONS') {
      res.writeHead(204) 
      res.end(
        JSON.stringify({
          message: 'prefligh request'
        })
      )
      return
    }
    const pathAndQuery = req.url.split('?')
    const path = pathAndQuery[0].split('/').slice(3)
    const query = pathAndQuery[1]

    console.log(path.join('/'))
    route(req, res, path.join('/'), query)
  })

  server.listen(port, host, () => {
    console.log(`Server running at http://${host}:${port}`)
  })
})()
