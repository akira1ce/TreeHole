const express = require("express");
const multipart = require("connect-multiparty");
const socketCtrl = require("../controller/socket");

const multipartyMid = multipart();
const router = express.Router();

// 添加
router.post("/addSocket", multipartyMid, socketCtrl.addSocket);
// 删除
router.post("/removeById", multipartyMid, socketCtrl.removeById);
// 修改
router.post("/modifyById", multipartyMid, socketCtrl.modifyById);
// 获取聊天列表
router.post("/getSocketByUserID", multipartyMid, socketCtrl.getSocketByUserID);

module.exports = router;
