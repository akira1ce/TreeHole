const express = require("express");
const multipart = require("connect-multiparty");
const recordCtrl = require("../controller/record");

const multipartyMid = multipart();
const router = express.Router();

// 获取用户全部记录 [关注、粉丝、收藏、历史记录]
router.post("/getRecordByUserID", multipartyMid, recordCtrl.getRecordByUserID);
// 修改记录
router.post("/modifyRecord", multipartyMid, recordCtrl.modifyRecord);

module.exports = router;
