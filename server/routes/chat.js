const express = require('express');
const router = express.Router();
const { getAllChats, getOneChat } = require('../controllers/chatController'); // Adjust the path as needed

router.get('/getall', getAllChats);
router.get('/getchat', getOneChat);

module.exports = router;
