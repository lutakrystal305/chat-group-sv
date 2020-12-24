var express = require("express");
var router = express.Router();
var controller = require("../controller/login.controller");

router.post('/login', controller.login);
router.post('/check', controller.check);
router.post('/create', controller.create);

module.exports = router;