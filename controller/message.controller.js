const Message = require('../models/message.model');
const Room = require('../models/room.model');
const mongoose = require('mongoose');

module.exports.message = async (req, res, next) => {
    //console.log(req.body.group);

    req.body.group = JSON.parse(req.body.group);
    //console.log(req.body.group._id);
   //.sort({date: 1}).exec(function(err, result) {
        //if (err) throw err;
        //console.log(result)
    //});
    const mess = await Message.find();
    req.body.group._id = mongoose.Types.ObjectId(req.body.group._id);
    const messages = await Message.find({to: req.body.group._id}).sort({date: -1})
    //console.log(messages);
    if (messages.length === 0) {
        console.log(false); 
        res.json([]);
    } else {
        console.log(messages.length);
        res.json(messages);
    }
}
/*module.exports.topMess = async (req, res, next) => {
    req.body._id = mongoose.Types.ObjectId(req.body._id);
    req.body.update = new Date(req.body.update);
    req.body.__v = 0;
    const top = await Message.find({to:req.body}).sort({date: -1});
    res.json(top[0]);
}*/
module.exports.upMess = async (req, res, next) => {
    console.log('up message');
    //console.log(req.body);
    //req.body.to = JSON.parse(req.body.to);
    req.body.from = JSON.parse(req.body.from);
    req.body.from._id = req.body.from.id;
    //console.log(req.body.from._id);
    //console.log(req.body.date);
    //req.body.to = mongoose.Types.ObjectId(req.body.to._id);
    //console.log(req.body.to)
    const newMess = await new Message(req.body);
    await newMess.save();
    const updateRoom = await Room.findOneAndUpdate({_id: req.body.to}, {
        topMess: newMess,
        update: req.body.date
    });
    res.json(newMess+updateRoom);
}