var express = require('express');
var commonController = require('../controllers/common.controller');
var router = express.Router();

//router.get('/subject/:name/:date', commonController.getSubject);

router.get('/sleepData/:name/:date', commonController.getSleepData);

//pdf

//email

module.exports = router;
