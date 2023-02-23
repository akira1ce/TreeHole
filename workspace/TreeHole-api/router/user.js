/*
 * @Author: Akira
 * @Date: 2022-11-05 10:51:57
 * @LastEditTime: 2023-02-23 17:22:20
 */
const express = require("express");
const userCtrl = require("../controller/user");

const router = express.Router();

// 注册
router.post("/register", userCtrl.register);
// 登陆
router.post("/login", userCtrl.login);
// 删除用户
router.post("/removeById", userCtrl.removeById);
// 修改用户
router.post("/modifyById", userCtrl.modifyById);
// 查询用户列表
router.post("/getUserList", userCtrl.getUserList);
// 查询用户集合列表
router.post("/getUserListByID", userCtrl.getUserListByID);
// 查询用户
router.post("/getUserById", userCtrl.getUserById);

module.exports = router;
