/*
 * @Author: Akira
 * @Date: 2023-04-11 23:34:15
 * @LastEditTime: 2023-04-11 23:34:20
 */
const express = require("express");
const followCtrl = require("../controller/follow");

const router = express.Router();

// 关注
router.post("/addFollow", followCtrl.addFollow);
// 取消关注
router.post("/removeFollow", followCtrl.removeFollow);
// 查询关注粉丝数量
router.post("/getFollowCount", followCtrl.getFollowCount);
// 查询是否关注
router.post("/isFollow", followCtrl.isFollow);

module.exports = router;
