const express = require('express');
const router = express.Router();
const { getAllShortCuts, createShortcut } = require('../controllers/shortcutController');
router.get('/getallshortcuts', getAllShortCuts);
router.post('/createshortcut', createShortcut);

module.exports = router;
