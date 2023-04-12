/*
 * @Author: Akira
 * @Date: 2023-04-11 23:52:51
 * @LastEditTime: 2023-04-11 23:53:54
 */
const express = require("express");
const collectCtrl = require("../controller/collect");

const router = express.Router();

/** 收藏 */
router.post("/addCollect", collectCtrl.addCollect);
/** 取消收藏 */
router.post("/removeCollect", collectCtrl.removeCollect);
/** 查询收藏列表 */
router.post("/getCollectList", collectCtrl.getCollectList);
/** 查询是否收藏 */
router.post("/isCollect", collectCtrl.isCollect);

module.exports = router;