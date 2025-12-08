const express = require("express");
const {
  getNotes: getDashboardSummary,
} = require("../controllers/dashboardController");

const router = express.Router();

router.get("/summary", getDashboardSummary);

module.exports = router;
