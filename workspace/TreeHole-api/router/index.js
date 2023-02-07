const multipart = require("connect-multiparty");
const express = require("express");
const router = express.Router();

const multipartyMid = multipart();

router.use("/user", multipartyMid, require("./user"));
router.use("/tree", multipartyMid, require("./tree"));
router.use("/uploadCenter", require("./upload"));
router.use("/record", multipartyMid, require("./record"));
router.use("/order", multipartyMid, require("./order"));
router.use("/socket", multipartyMid, require("./socket"));
router.use("/alipay", multipartyMid, require("./alipay"));
router.use("/comment", multipartyMid, require("./comment"));

module.exports = router;
