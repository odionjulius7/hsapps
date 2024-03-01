const express = require("express");
const testimonyController = require("../controllers/testimony");
const router = express.Router();

router.post("/", testimonyController.postTestimony);
router.get("/all", testimonyController.getTestimony);
router.get("/:id", testimonyController.getATestimony);

module.exports = router;
