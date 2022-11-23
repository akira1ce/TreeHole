const express = require("express");
const orderCtrl = require("../controller/order");

const router = express.Router();

// 添加
router.post("/addOrder", orderCtrl.addOrder);
// 删除
router.post("/removeById", orderCtrl.removeById);
// 修改
router.post("/modifyById", orderCtrl.modifyById);
// 获取订单列表
router.get("/getOrderList", orderCtrl.getOrderList);

module.exports = router;
