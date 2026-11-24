const express = require('express');
const router = express.Router();
const { getSettings, updateSettings } = require('../data/settingsData');

// GET settings
router.get('/', (req, res) => {
  res.json(getSettings());
});

// PUT update settings
router.put('/', (req, res) => {
  const updated = updateSettings(req.body);
  res.json({ success: true, settings: updated });
});

module.exports = router;
