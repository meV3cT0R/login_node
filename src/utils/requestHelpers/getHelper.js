const { filterHelper } = require("../filterHelper");
const client = require("mssql")
function getHelper(
  req,
  res,
  params,
  hel,
  defaultOrderBy,
  discardColumns=[],
  dependencies = {},
  onError = () => {},
  onSuccess = () => {},
) {
  const query = filterHelper(hel.startStr, hel.endStr, params,defaultOrderBy);
  console.log("retrieving Data");
  client.query(query, (err, result) => {
    if (err) {
      console.log(err);
      res.statusCode = 400;
      onError();
      res.end(
        JSON.stringify({
          error: "Something went wrong",
        }),
      );
      return;
    }
    onSuccess();

    


    // const func =async ()=> {

    //   return  Object.keys(result.recordset).map(async (key)=> {
    //     const obj = {};
    //     for(const k in result.recordset[key]){
    //         if(discardColumns.includes(k)) continue;
    //         obj[k] = result.recordset[key][k];
    //     }
    //     for(const key in dependencies) {
    //       console.log(`Adding dependency : ${key} `);
    //       const d_query = `select * from ${dependencies[key].table_name} where ${key}=${obj[key]}`  
    //       console.log(`query for dependency ${d_query}`);

    //       const func = async ()=> {
    //         return new Promise((resolve,_)=> {

    //         client.query(d_query,(err,depResult)=> {
    //           if(err) {
    //               if(err instanceof Error) {
    //                 console.log(err.message);
    //               }else
    //                 console.log(err);
    //               return;
    //           }
    //           delete obj[key];
    //           resolve(result.recordset);
    //           console.log(`dependency result : ${key} : `,depResult.recordset)
    //         })
    //       })

    //       }
    //        func().then(val=>{
    //         obj[dependencies[key].name] = val;
    //         console.log(val);
    //        })
    //     }
    //     console.log(obj);
    //     return obj;
    //   })
    // }



    // func().then(dataTobeSent=> {
    //   console.log(`data to be sent : ${JSON.stringify(dataTobeSent)}`) ; 
    //   console.log(dependencies)
  
    dataTobeSent = Object.keys(result.recordset).map(key=> {
      const obj = {}
      for(const k in result.recordset[key]){
        if(discardColumns.includes(k)) continue;
        obj[k] = result.recordset[key][k];
} 
    return obj;
    });
    console.log(dataTobeSent)
      res.statusCode = 200;
      
      res.setHeader("Content-Type", "application/json");
      res.end(
        JSON.stringify({
          ...dataTobeSent
        }),
      );
    })
  
  // });
}

module.exports = { getHelper };