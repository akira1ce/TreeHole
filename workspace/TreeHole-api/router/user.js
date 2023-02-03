const express = require("express");
const userCtrl = require("../controller/user");

const router = express.Router();

// 注册
router.post("/register", userCtrl.register);
// 登陆
router.post("/login", userCtrl.login);
// 删除
router.post("/removeById", userCtrl.removeById);
// 修改
router.post("/modifyById", userCtrl.modifyById);
// 获取用户列表
router.get("/getUserList", userCtrl.getUserList);
router.post("/getUserListByID", userCtrl.getUserListByID);
// 获取用户
router.post("/getUserById", userCtrl.getUserById);

module.exports = router;
