const express = require("express");
const router = express.Router();
const controller1 = require("../controller/message.controller");
const controller2 = require('../controller/room.controller');
const verify = require("../middleware/verify.middleware");

router.post('/message', verify, controller1.message);
//router.post('/topMess', controller1.topMess);
router.post('/upMess', verify, controller1.upMess);
router.get('/getRooms', verify, controller2.getRooms);
router.post('/findRoom', verify, controller2.findRoom);
router.post('/createRoom', verify, controller2.createRoom);
router.post('/checkRoom', verify, controller2.checkRoom);
router.post('/getRoom', verify,controller2.getRoom);
router.post('/leaveRoom', verify, controller2.leaveRoom);

module.exports = router;