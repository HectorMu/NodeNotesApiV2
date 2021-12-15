const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/verifyToken");

const controller = require("../controllers/profile.controller");

router.post("/api/profile/editnames", verifyToken, controller.editNames);

router.post(
  "/api/profile/changepassword",
  verifyToken,
  controller.changePassword
);

module.exports = router;
