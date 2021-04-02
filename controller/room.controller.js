const Room = require('../models/room.model');
const Message = require('../models/message.model');
const User = require('../models/user.model');
const mongoose = require('mongoose');

module.exports.getRooms = async (req, res, next) => {
    const rooms = await Room.find();
    res.json(rooms);
}
module.exports.findRoom = async (req, res, next) => {
    const room = await Room.find();
    const rooms = room.filter(x => 
         x.name.toLowerCase().indexOf(req.body.nameRoom.toLowerCase()) !== -1
    );
    res.json(rooms);
}
module.exports.createRoom = async (req, res, next) => {
    const newRoom = new Room({name: req.body.nameRoom, host: req.body.user._id, members: [req.body.user._id], topMess: {message: `welcome to ${req.body.nameRoom} room`, from: {name:'key'}}});
    await newRoom.save();
    if (newRoom) {
        const user = await User.findOneAndUpdate({_id: req.body.user._id}, {$push: {
            groups: newRoom._id
        } })
        const newMessage = await new Message({message: `welcome to ${newRoom.name} room`, from: {name:'key'}, to: newRoom._id});
        newMessage.save();
    }
    res.json(newRoom);
}
module.exports.checkRoom = async (req, res, next) => {
    const room = await Room.findOne({_id: req.body._id});
    let yes = false;
    room.members.forEach(x => {
        if (x === req.body.user._id) {
            yes = true;
        }
    })
    if (yes) {
        res.json({room: room});
        console.log('hehe');
    } else {
        console.log('vl');
        const updateRoom = await Room.findByIdAndUpdate({_id: req.body._id}, {$push: {
            members: req.body.user._id
        }, $set: {
            topMess: {message:`${req.body.user.name} has just entered room!`, from: {name: 'key'}, to:room._id, date: Date.now()}
        }
        });
        const updateUser = await User.findOneAndUpdate({_id: req.body.user._id}, {$push: {
            groups: room._id
        }});
        const nMessage = new Message({message:`${req.body.user.name} has just entered room!`, from: {name: 'key'}, to:room._id})
        await nMessage.save()
        res.json({room: updateRoom, user: updateUser, message: nMessage});
    }
}
module.exports.getRoom = async (req, res, next) => {
    //req.body.user._id =mongoose.Types.ObjectId(req.body.user._id);
    //req.body.user.update = new Date(req.body.user.update);
    let rooms = await Room.find({members: {$in: [req.body.user._id]}}).sort({update: -1});
    //console.log(rooms);
    res.json({yourRoom: rooms});
   
}
module.exports.upAvt = async (req, res, next) => {
    try {
      console.log(req.body.data, "***");
      let room = await Room.findOneAndUpdate({_id: req.body._id}, {
          avt: req.body.data
      });
      res.json(room);
    } catch(error) {
      console.log(error);
    }
  }
module.exports.leaveRoom = async (req, res, next) => {
    const updateUser = await User.findOneAndUpdate({_id: req.body.user._id}, {
        $pull: {groups: req.body.room._id} //toString() -> console
    })
    const updateRoom = await Room.findOneAndUpdate({_id: req.body.room._id}, {
        $pull: {members: req.body.user._id}
    })
    res.json(updateUser+ updateRoom);
}