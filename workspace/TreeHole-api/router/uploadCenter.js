const express = require("express");
const multipart = require("connect-multiparty");
const uploadCtrl = require("../controller/uploadCtrl");

const router = express.Router();

// 上传
router.post("/upload", uploadCtrl.uploadFiles);
// 获取
router.post("/files", uploadCtrl.getListFiles);
// 下载
router.get("/files/:name", uploadCtrl.download);

module.exports = router;
