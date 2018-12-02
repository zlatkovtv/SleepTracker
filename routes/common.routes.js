var express = require('express');
var commonController = require('../controllers/common.controller');
var router = express.Router();

router.get('/sleepData/:name/:date', commonController.getSleepData);

module.exports = router;
