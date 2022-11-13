const express = require("express");
const router = express.Router();

router.use("/user", require("./user"));
router.use("/tree", require("./tree"));
router.use("/uploadCenter", require("./upload"));
router.use("/record", require("./record"));
router.use("/order", require("./order"));
router.use("/socket", require("./socket"));

module.exports = router;
