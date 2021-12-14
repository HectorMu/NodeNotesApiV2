const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/verifyToken");

const controller = require("../controllers/notes.controller");

router.get("/api/test", controller.test);
router.get("/api/listall", controller.ListAll);
router.get("/api/listone/:idnote", controller.ListOne);
router.post("/api/save", verifyToken, controller.Save);
router.delete("/api/delete/:idnote", verifyToken, controller.Delete);
router.put("/api/update/:idnote", verifyToken, controller.Update);

module.exports = router;
