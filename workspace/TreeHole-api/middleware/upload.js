/*
 * @Author: Akira
 * @Date: 2022-11-10 09:49:00
 * @LastEditTime: 2023-02-20 16:46:43
 */
const util = require("util");
const multer = require("multer");
const { GridFsStorage } = require("multer-gridfs-storage");
const { config } = require("../util");

var storage = new GridFsStorage({
  url: config.url + config.database,
  options: { useNewUrlParser: true, useUnifiedTopology: true },
  file: (req, file) => {
    return {
      bucketName: config.filesBucket,
      filename: `${Date.now()}-${file.originalname}`,
    };
  },
});

// 大小限制
const maxSize = 5 * 1024 * 1024;

var uploadFiles = multer({
  storage: storage,
  limits: { fileSize: maxSize },
}).single("file");

var uploadFilesMiddleware = util.promisify(uploadFiles);
module.exports = uploadFilesMiddleware;
