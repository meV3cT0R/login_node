const client = require("mssql");


function deleteQueryBuilder(body,table_name,conditions) {
    if(!conditions)
            throw new Error("No conditions given, for building query");
    console.log("Delete Query Building");
    let query = `delete from ${table_name} where `;
    for(const val of conditions) {
        if(val in body) {
            query += `${val}=${body[val]}`
        }else
            throw new Error(`no ${val} in body`);
    }
    console.log(`query built : ${query}`);
    return query;
}

function deleteHelper(req, res, params, table_name,config ) {
    let body = [];
    req
        .on("data", (chunk) => {
            body.push(chunk);
            console.log("Parsing Request Body");
        })
        .on("end", () => {
            body = Buffer.concat(body).toString();
            console.log(body);

            body = JSON.parse(body);
            console.log("Request Body Parsed");
            console.log(body);

            const query = deleteQueryBuilder(body,table_name,config.conditions);
            client.query(query, (err, _) => {
                if (err) {
                    console.log("Error occured");
                    console.log(err);
                    res.statusCode = 400;
                    res.end(
                        JSON.stringify({
                            message: "Something went wrong",
                        }),
                    );
                    return;
                }
                console.log("Data Successfully Deleted");
                res.statusCode = 204;
                res.end();
            })
        })
}

module.exports = { deleteHelper }