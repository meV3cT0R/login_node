const client = require("mssql")

async function query(query,data) {
    return new Promise((resolve,reject)=> {
            client.query()
    })
}

module.exports = { query }