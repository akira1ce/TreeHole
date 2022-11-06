const util = require("util");
const { result } = require("../util");

module.exports = () => {
  return (err, req, res, next) => {
    res.send(result(err.status, "", err.message || err));
  };
};
