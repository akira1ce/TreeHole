const express = require("express");
const recordCtrl = require("../controller/record");

const router = express.Router();

// 获取用户全部记录 [关注、粉丝、收藏、历史记录]
router.post("/getRecordByUserID", recordCtrl.getRecordByUserID);
// 修改记录
router.post("/modifyRecordUser", recordCtrl.modifyRecordUser);
router.post("/modifyRecordTree", recordCtrl.modifyRecordTree);
router.post("/modifyRecordOrder", recordCtrl.modifyRecordOrder);

module.exports = router;
