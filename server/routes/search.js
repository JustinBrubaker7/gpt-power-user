const express = require('express');
const router = express.Router();
const { searchManyChats } = require('../controllers/searchController'); // Adjust the path as needed

router.get('/searchmany', searchManyChats);

module.exports = router;
