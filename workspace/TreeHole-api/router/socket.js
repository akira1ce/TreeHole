/*
 * @Author: Akira
 * @Date: 2022-11-13 15:25:18
 * @LastEditTime: 2023-02-20 16:49:25
 */
const express = require("express");
const socketCtrl = require("../controller/socket");

const router = express.Router();

// 添加会话
router.post("/addSocket", socketCtrl.addSocket);
// 删除会话
router.post("/removeById", socketCtrl.removeById);
// 修改会话
router.post("/modifyById", socketCtrl.modifyById);
// 查询用户会话列表
router.post("/getSocketListByUserID", socketCtrl.getSocketListByUserID);
// 查询会话集合列表
router.post("/getSocketListByID", socketCtrl.getSocketListByID);

module.exports = router;
