const express = require("express");
const router = express.Router();
const controller1 = require("../controller/message.controller");
const controller2 = require('../controller/room.controller');

router.post('/message', controller1.message);
//router.post('/topMess', controller1.topMess);
router.post('/upMess', controller1.upMess);
router.get('/getRooms', controller2.getRooms);
router.post('/findRoom', controller2.findRoom);
router.post('/createRoom', controller2.createRoom);
router.post('/checkRoom', controller2.checkRoom);
router.post('/getRoom', controller2.getRoom);
router.post('/leaveRoom', controller2.leaveRoom);

module.exports = router;