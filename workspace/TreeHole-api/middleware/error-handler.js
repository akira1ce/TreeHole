const util = require("util");
const { result } = require("../util");

module.exports = () => {
  return (err, req, res, next) => {
    if (err.name == "UnauthorizedError") {
      res.send(result(10000, "", err.message || err));
      return;
    }
    res.send(result(err.status || 500, "", err.message || err));
  };
};
