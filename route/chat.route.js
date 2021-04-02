const express = require("express");
const router = express.Router();
const controller1 = require("../controller/message.controller");
const controller2 = require('../controller/room.controller');
const middleware = require("../middleware/verify.middleware");

router.post('/message', middleware.verify, controller1.message);
//router.post('/topMess', controller1.topMess);
router.post('/upMess', middleware.verify, controller1.upMess);
router.get('/getRooms', middleware.verify, controller2.getRooms);
router.post('/findRoom', middleware.verify, controller2.findRoom);
router.post('/createRoom', middleware.verify, controller2.createRoom);
router.post('/checkRoom', middleware.verify, controller2.checkRoom);
router.post('/getRoom', middleware.verify, controller2.getRoom);
router.post('/leaveRoom', middleware.verify, controller2.leaveRoom);
router.post('/upAvt', middleware.verify, controller2.upAvt);

module.exports = router;