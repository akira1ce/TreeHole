const express = require("express");
const socketCtrl = require("../controller/socket");

const router = express.Router();

// 添加
router.post("/addSocket", socketCtrl.addSocket);
// 删除
router.post("/removeById", socketCtrl.removeById);
// 修改
router.post("/modifyById", socketCtrl.modifyById);
// 获取聊天列表
router.post("/getSocketByUserID", socketCtrl.getSocketByUserID);
router.post("/getSocketListByID", socketCtrl.getSocketListByID);

module.exports = router;
