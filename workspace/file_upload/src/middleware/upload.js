const util = require("util");
const multer = require("multer");
const { GridFsStorage } = require("multer-gridfs-storage");
const dbConfig = require("../config/db");

var storage = new GridFsStorage({
  url: dbConfig.url + dbConfig.database,
  options: { useNewUrlParser: true, useUnifiedTopology: true },
  file: (req, file) => {
    return {
      bucketName: dbConfig.filesBucket,
      filename: `${Date.now()}-${file.originalname}`,
    };
  },
});
const maxSize = 2 * 1024 * 1024;
var uploadFiles = multer({
  storage: storage,
  limits: { fileSize: maxSize },
}).single("file");
var uploadFilesMiddleware = util.promisify(uploadFiles);
module.exports = uploadFilesMiddleware;
