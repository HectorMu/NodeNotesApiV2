const express = require("express");
const router = express.Router();

const controller = require("../controllers/auth.controller");

router.post("/api/login", controller.login);
router.post("/api/signup", controller.signup);
router.post("/api/recover-password/", controller.sendRecoverEmail);
router.get(
  "/api/verify-email-token/:token",
  controller.VerifyRecoverEmailToken
);
router.post("/api/reset-password/:token", controller.ResetPassword);

module.exports = router;
