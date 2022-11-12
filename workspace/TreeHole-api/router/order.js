const express = require("express");
const multipart = require("connect-multiparty");
const orderCtrl = require("../controller/order");

const multipartyMid = multipart();
const router = express.Router();

// 添加
router.post("/addOrder", multipartyMid, orderCtrl.addOrder);
// 删除
router.post("/removeById", multipartyMid, orderCtrl.removeById);
// 修改
router.post("/modifyById", multipartyMid, orderCtrl.modifyById);
// 获取订单列表
router.get("/getOrderList", multipartyMid, orderCtrl.getOrderList);

module.exports = router;
