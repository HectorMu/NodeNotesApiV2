const express = require("express");
const router = express.Router();

const controller = require("../controllers/auth.controller");

router.post("/api/login", controller.login);
router.post("/api/signup", controller.signup);

module.exports = router;
