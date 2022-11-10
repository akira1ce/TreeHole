const express = require("express");
const router = express.Router();

router.use("/user", require("./user"));
router.use("/tree", require("./tree"));
router.use("/uploadCenter", require("./uploadCenter"));
module.exports = router;
