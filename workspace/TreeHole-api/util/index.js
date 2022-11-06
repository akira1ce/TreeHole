function result(code, data, message) {
  return { code, data, message };
}

const config = {
  secretKey: "amoslier",
};
module.exports = {
  result,
  config,
};
