const express = require("express");
const socketContentCtrl = require("../controller/socketContent");

const router = express.Router();

// 添加会话
router.post("/addSocketContent", socketContentCtrl.addSocketContent);
// 查询会话内容
router.post("/getSocketContentBySid", socketContentCtrl.getSocketContentBySid);

module.exports = router;
