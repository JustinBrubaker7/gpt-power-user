const express = require('express');
const router = express.Router();
const { getAllChats, getOneChat, pinChatById } = require('../controllers/chatController'); // Adjust the path as needed

router.get('/getall', getAllChats);
router.get('/getchat', getOneChat);
router.patch('/pin', pinChatById);

module.exports = router;
