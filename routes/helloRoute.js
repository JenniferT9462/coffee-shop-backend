const express = require('express');
const router = express.Router();

router.get("/hello", (req, res) => {
  res.status(200).json({ message: "Backend is running!" });
});

module.exports = router;
