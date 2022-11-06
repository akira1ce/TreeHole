const express = require("express");
const multipart = require("connect-multiparty");
const userCtrl = require("../controller/user");

const multipartyMid = multipart();
const router = express.Router();

// 注册
router.post("/register", multipartyMid, userCtrl.register);
// 登陆
router.post("/login", multipartyMid, userCtrl.login);

// router.post("/removeById", userCtrl.removeById);
// router.post("/modifyById", userCtrl.modifyById);
// 获取用户列表
router.get("/getUserList", multipartyMid, userCtrl.getUserList);

module.exports = router;
