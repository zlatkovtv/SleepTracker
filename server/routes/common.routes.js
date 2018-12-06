var express = require('express');
var commonController = require('../controllers/common.controller');
var router = express.Router();

router.post('/sleepData/', commonController.getSleepData);

module.exports = router;
