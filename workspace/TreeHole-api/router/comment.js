const express = require("express");
const commentCtrl = require("../controller/comment");

const router = express.Router();

// 查
router.post("/getCommentByTreeID", commentCtrl.getCommentByTreeID);
// 删
router.post("/removeById", commentCtrl.removeById);
// 增
router.post("/addComment", commentCtrl.addComment);

module.exports = router;
