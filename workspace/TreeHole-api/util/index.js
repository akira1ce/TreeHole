function result(code, data, message) {
  return { code, data, message };
}

function err(e, status, data) {
  message = e.toString().split('"').join("");
  return {
    status,
    data,
    message,
  };
}
const config = {
  secretKey: "amoslier",
  url: "mongodb://localhost:27017/",
  database: "files_db",
  dbName:'TreeHoles',
  filesBucket: "fs",
};
module.exports = {
  result,
  config,
  err,
};
