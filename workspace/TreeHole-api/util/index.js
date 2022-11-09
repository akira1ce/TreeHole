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
};
module.exports = {
  result,
  config,
  err,
};
