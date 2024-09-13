function extractParams(rawParam) {
    const param = {};
    if (!rawParam) return param;
    const par = rawParam.split("&");
    for (const p of par) {
      const pt = p.split("=");
      if (p.trim() == "") continue;
      param[pt[0]] =
        pt[1]
          ?.replaceAll("%20", " ")
          .replaceAll("%27", "'")
          .replaceAll("%22", '"') || "";
      console.log(pt[0], param[pt[0]]);
    }
    if ("$top" in param) {
      const totTop = param["$top"];
      delete param["$top"];
      param["$top"] = totTop;
    }
    return param;
  }
  
  module.exports = { extractParams };