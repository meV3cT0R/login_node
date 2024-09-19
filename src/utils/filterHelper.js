const filters = {
    $orderby: (val) => {
      console.log(`$orderby filter : value : ${val}`);
      val = val.trim();
      const arr = val.split(" ");
      console.log(arr);
      if (arr.length > 2) {
        throw new Error("Filter Went Wrong");
      }
      return [`order by ${arr[0]} ${arr[1] || "asc"}`, 2];
    },
    $top: (val) => {
      return [`fetch next ${val} rows only`, 0];
    },
    $skip: (val) => {
      return [`offset ${val} rows`, 1];
    },
    $filter: (val) => {
      val = val.trim();
      const arr = val.split(" ");
      console.log(arr);
      const strToSym = {
        eq: "=",
        gt: ">",
        lt: ",",
        ge: ">=",
        le: "<=",
        ne: "!=",
        is: "is",
      };
      let str = "where ";
      for (const a of arr) {
        if (a in strToSym) {
          str += `${strToSym[a]} `;
          continue;
        }
        str += `${a} `;
      }
      return [str, 3];
    },
  };
  
  function filterHelper(start, end, params,defaultOrderBy="id asc") {
    console.log("Building Query String");
    if(!("$orderby" in params)) params["$orderby"] = defaultOrderBy

    if(!("$skip" in params) && ("$top" in params)) {
      params["$skip"] = 0
    }
    let tempStrArr = [[start, 4]];
    console.log(`Looping through ${JSON.stringify(params)}`)
    for (const k in params) {
      console.log(`params[${k}] : ${params[k]}`);
      tempStrArr.push(filters[k](params[k]));
    }
    tempStrArr.push([end, -1]);
  
    tempStrArr.sort((a, b) => {
      if (a[1] > b[1]) return -1;
      else return 1;
    });
  
    const query = tempStrArr.map((val) => val[0]).join(" ");
    console.log(`Query String built : ${query}`);
    return query;
  }
  
  module.exports = { filterHelper };