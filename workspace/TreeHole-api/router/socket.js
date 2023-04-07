/*
 * @Author: Akira
 * @Date: 2022-11-13 15:25:18
 * @LastEditTime: 2023-04-07 23:21:18
 */
const express = require("express");
const socketCtrl = require("../controller/socket");

const router = express.Router();

// 添加会话
router.post("/addSocket", socketCtrl.addSocket);
// 查询会话集合列表
router.post("/getSocketListByID", socketCtrl.getSocketListByID);

module.exports = router;
