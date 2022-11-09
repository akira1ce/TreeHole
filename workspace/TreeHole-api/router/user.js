const express = require("express");
const multipart = require("connect-multiparty");
const userCtrl = require("../controller/user");

const multipartyMid = multipart();
const router = express.Router();

// 注册
router.post("/register", multipartyMid, userCtrl.register);
// 登陆
router.post("/login", multipartyMid, userCtrl.login);
// 删除
router.post("/removeById", multipartyMid, userCtrl.removeById);
// 修改
router.post("/modifyById", multipartyMid, userCtrl.modifyById);
// 获取用户列表
router.get("/getUserList", multipartyMid, userCtrl.getUserList);

module.exports = router;
