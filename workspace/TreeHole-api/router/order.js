/*
 * @Author: Akira
 * @Date: 2022-11-12 10:12:11
 * @LastEditTime: 2023-03-01 11:48:25
 */
const express = require("express");
const orderCtrl = require("../controller/order");

const router = express.Router();

/** 增加订单 */
router.post("/addOrder", orderCtrl.addOrder);
/** 删除订单 */
router.post("/removeById", orderCtrl.removeById);
/** 修改订单 */
router.post("/modifyById", orderCtrl.modifyById);
router.post("/modifyByTreeID", orderCtrl.modifyByTreeID);
/** 查询订单列表 */
router.post("/getOrderList", orderCtrl.getOrderList);
/** 查询订单集合列表 */
router.post("/getOrderListByID", orderCtrl.getOrderListByID);
/** 订单列表[用户] */
router.post("/getOrderListByUserID", orderCtrl.getOrderListByUserID);
/** 获取订单[苗木] */
router.post("/getOrderByTreeID", orderCtrl.getOrderByTreeID);
router.post("/dataAnalysis", orderCtrl.dataAnalysis);

module.exports = router;
