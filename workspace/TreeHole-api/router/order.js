const express = require("express");
const orderCtrl = require("../controller/order");

const router = express.Router();

// 添加
router.post("/addOrder", orderCtrl.addOrder);
// 删除
router.post("/removeById", orderCtrl.removeById);
// 修改
router.post("/modifyById", orderCtrl.modifyById);
// 获取所有的订单列表
router.get("/getOrderList", orderCtrl.getOrderList);
// 获取用户的订单列表
router.post("/getOrderListByUserID", orderCtrl.getOrderListByUserID);

module.exports = router;
