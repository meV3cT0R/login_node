function dateYMD (date) {
  if(!(date instanceof Date)) throw new Error("Not Valid Date")
  return `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;
}

module.exports = { dateYMD }
