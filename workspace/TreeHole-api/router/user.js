const express = require("express");
const userCtrl = require("../controller/user");

const router = express.Router();

// router.post("/save", userCtrl.save);
// router.post("/removeById", userCtrl.removeById);
// router.post("/modifyById", userCtrl.modifyById);
router.get("/getAll", userCtrl.getAll);

module.exports = router;