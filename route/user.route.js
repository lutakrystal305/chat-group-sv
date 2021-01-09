var express = require("express");
var router = express.Router();
var controller = require("../controller/user.controller");

router.post('/login', controller.login);
router.post('/check', controller.check);
router.post('/create', controller.create);
router.post('/getMember', controller.getMember);
router.post('/loginFB', controller.loginFB);
//router.post('/getRoom', controller.getRoom);

module.exports = router;