const { filterHelper } = require('../filterHelper')
const client = require('mssql')
function getHelper (
  req,
  res,
  params,
  hel,
  defaultOrderBy,
  discardColumns = [],
  dependencies = {}
) {
  const query = filterHelper(hel.startStr, hel.endStr, params, defaultOrderBy)
  console.log('retrieving Data')
  client
    .query(query)
    .then(result => {
      dataTobeSent = Object.keys(result.recordset).map(key => {
        const obj = {}
        for (const k in result.recordset[key]) {
          if (discardColumns.includes(k)) continue
          obj[k] = result.recordset[key][k]
        }
        return obj
      })
      console.log(dataTobeSent)
      res.statusCode = 200

      res.setHeader('Content-Type', 'application/json')
      res.end(
        JSON.stringify({
          ...dataTobeSent
        })
      )
    })
    .catch(err => {
      if (err) {
        console.log(err)
        res.statusCode = 400
        res.end(
          JSON.stringify({
            error: 'Something went wrong'
          })
        )
        return
      }
    })

  // });
}

module.exports = { getHelper }
