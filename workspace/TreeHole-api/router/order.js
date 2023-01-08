const express = require("express");
const orderCtrl = require("../controller/order");

const router = express.Router();

// 增
router.post("/addOrder", orderCtrl.addOrder);
// 删
router.post("/removeById", orderCtrl.removeById);
// 改
router.post("/modifyById", orderCtrl.modifyById);
router.post("/modifyByTreeID", orderCtrl.modifyByTreeID);
// 查
router.get("/getOrderList", orderCtrl.getOrderList);

// 订单列表[用户]
router.post("/getOrderListByUserID", orderCtrl.getOrderListByUserID);
// 获取订单[苗木]
router.post("/getOrderByTreeID", orderCtrl.getOrderByTreeID);

module.exports = router;
