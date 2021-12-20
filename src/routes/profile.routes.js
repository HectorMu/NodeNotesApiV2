const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/verifyToken");

const controller = require("../controllers/profile.controller");

router.get("/api/profile", verifyToken, controller.getProfileData);
router.post("/api/profile/delete", verifyToken, controller.deleteProfile);
router.post("/api/profile/editnames", verifyToken, controller.editNames);

router.post(
  "/api/profile/changepassword",
  verifyToken,
  controller.changePassword
);

module.exports = router;
