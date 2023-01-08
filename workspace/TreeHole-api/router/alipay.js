const express = require("express");
const alipayCtrl = require("../controller/alipay");

const router = express.Router();

router.post("/pagePay", alipayCtrl.pagePay);
router.post("/refund", alipayCtrl.refund);

module.exports = router;
