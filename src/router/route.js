const { extractParams } = require("../utils/extractParam");
const { routeConfig } = require("./config");

async function route(req, res, path, param) {
  const func = ()=> {
    res.statusCode = 403;
    res.setHeader("Content-Type", "application/json");
    res.end(
      JSON.stringify({
        message: "Not Found",
      }),
    );
    return;
  }
  if(!path) return func();
  console.log(path);
  console.log(req.method);
  if(!routeConfig[req.method.toLowerCase()]) return func();
  const f = routeConfig[req.method.toLowerCase()][path];
  if (!f) return func();


  f(req, res, extractParams(param));
}
module.exports = { route };