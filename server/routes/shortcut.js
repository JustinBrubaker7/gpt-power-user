const express = require('express');
const router = express.Router();
const { getAllShortCuts, createShortcut, deleteShortcut } = require('../controllers/shortcutController');
router.get('/getallshortcuts', getAllShortCuts);
router.post('/createshortcut', createShortcut);
router.delete('/deleteshortcut', deleteShortcut);

module.exports = router;
