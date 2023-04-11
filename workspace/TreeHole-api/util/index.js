/*
 * @Author: Akira
 * @Date: 2022-11-05 11:06:01
 * @LastEditTime: 2023-04-11 23:04:19
 */
function result(code, data, message) {
  return { code, data, message };
}

function err(e, status = 401, data = null) {
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
  dbName: "TreeHoles",
  filesBucket: "fs",
};

module.exports = {
  config,
  result,
  err,
};
