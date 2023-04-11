/*
 * @Author: Akira
 * @Date: 2023-04-12 00:03:58
 * @LastEditTime: 2023-04-12 00:06:18
 */
const express = require("express");
const historyCtrl = require("../controller/history");

const router = express.Router();

// 记录浏览
router.post("/addCollect", historyCtrl.addHistory);
// 清空浏览记录
router.post("/removeCollect", historyCtrl.removeAllHistory);
// 查询浏览记录列表
router.post("/getCollectList", historyCtrl.getHistoryList);

module.exports = router;
