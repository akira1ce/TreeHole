/*
 * @Author: Akira
 * @Date: 2022-11-05 11:06:01
 * @LastEditTime: 2023-02-20 16:51:32
 */
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
  dbName: "TreeHoles",
  filesBucket: "fs",
};

module.exports = {
  result,
  config,
  err,
};
