const express = require("express");
const alipayCtrl = require("../controller/alipay");

const router = express.Router();

// 统一pc页面支付
router.post("/pagePay", alipayCtrl.pagePay);
// 统一账单退款
router.post("/refund", alipayCtrl.refund);
// 统一支付账单查询
router.post("/query", alipayCtrl.query);

module.exports = router;
