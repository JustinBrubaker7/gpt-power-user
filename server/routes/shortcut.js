const express = require('express');
const router = express.Router();
const { getAllShortCuts } = require('../controllers/shortcutController');
router.get('/getallshortcuts', getAllShortCuts);

module.exports = router;
