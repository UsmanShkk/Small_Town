const express = require("express");
const { saveMealPlan, getMealPlan } = require("../controllers/parsedata");
const router = express.Router();

router.post("/save", saveMealPlan);
router.get("/:userId", getMealPlan);

module.exports = router;
