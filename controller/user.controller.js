const { cloudinary } = require('../utils/cloudinary');
const fs = require('fs');
const jwt = require("jsonwebtoken");
const md5 = require('md5');
const User = require('../models/user.model');
const Message = require('../models/message.model');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const transporter =  nodemailer.createTransport({ // config mail server
    service: 'gmail',
    auth: {
        user: 'lutakrystal305@gmail.com',
        pass: `${process.env.PASSWORD}`
    }
});

module.exports.login = async function (req, res, next) {
    try {
      console.log(req.body);
      const email = req.body.email;
      const password = req.body.password;
      const user = await User.findOne({email});
      if (!user) {
        res.status(401);
        res.json({ msg: 'Email does not exist!' });
        return;
      }
      const hashPassword =md5(password);
      if (user.password !== hashPassword) {
        res.status(401);
        res.json({ msg: "Password wrong" });
        return;
      } else {
        const token = jwt.sign({ _id: user._id }, "shhh");
        res.header("auth-token", token);
        const client = {
          email: email,
          password: password,
          token: token
        };
        //console.log(client);
        res.json(client);
      }
    } catch (error) {
      next(error);
    }
  };
  module.exports.loginFB = async (req, res, next) => {
  //console.log(req.body);
  const user = await User.findOne({userID: req.body.userID});
  if (!user) {
    const newUser= new User(req.body);
    await newUser.save();
    const token = jwt.sign({ _id: newUser._id }, "shhh");
    res.header("auth-token", token);
    const client = {
      newUser: newUser,
      token: token
    }
    //console.log(client);
    res.json(client);
  } else {
      const token = jwt.sign({ _id: user._id }, "shhh");
      res.header("auth-token", token);
      const client = {
        
        token: token
      };
      //console.log(client);
    res.json(client);
  }
}
  module.exports.check = async function (req, res, next) {
    const token = req.body.token;
  
    if (!token) {
      return;
    } else {
      const verified = jwt.verify(token, "shhh");
      const user = await User.findOne({_id: verified._id});
      if (user) {
        res.json(user);
      } else {
        console.log(false)
      }
    }
  }

  module.exports.create = async function (req, res, next) {
    const email = req.body.email;
    const user = await User.findOne({email});
    if (user) {
      res.status(400);
      res.json({ msg: "Email already exists" });
    } else {
      const passwordX = req.body.password
      req.body.password = md5(req.body.password);
  
      const newUser = await new User(req.body);
      newUser.save();
      var mainOptions = { // thiết lập đối tượng, nội dung gửi mail
        from: 'Luta Krystal',
        to: req.body.email,
        subject: 'Welcome to Amber!',
        text: 'You recieved Message from Amber',
        html: '<h1>Hi new member</h1><ul><li>Username:' + req.body.name + '</li><li>Email:' + req.body.email + '</li><li>Password:' + passwordX + '</li></ul>'
      }
      transporter.sendMail(mainOptions, function(err, info){
        if (err) {
            console.log(err);
        } else {
            console.log('Message sent: ' +  info.response);
        }
      });
      res.json(newUser);
    }
  }
  /*module.exports.getRoom = async (req, res, next) => {
    const user = await User.findOne({_id: req.body.user._id});
    user.groups = user.groups.sort((a,b) => b.update-a.update);
   /* user.groups.forEach(async (x) => {
      x._id = mongoose.Types.ObjectId(x._id);
      let mess = await Message.find({to: x._id}).sort({date: -1});
      x.topMess = mess[0];
      console.log(x.topMess);
    });*/
    //res.json({yourRoom : user.groups});
  //}
module.exports.getMember = async (req, res, next) => {
  const roomNow = req.body.roomNow;
  let members = [];
  for (let i = 0; i < roomNow.members.length; i++) {
    let member = await User.findOne({_id: mongoose.Types.ObjectId(roomNow.members[i])});
    members = [...members, member];

  };
  res.json({ members });
}
module.exports.upAvt = async (req, res, next) => {
  try {
    console.log(req.body.data);
    let a = Buffer.from(req.body.data).toString('base64');
    console.log(a);
    //var imageAsBase64 = fs.readFileSync(req.body.data, 'base64');
    //console.log(imageAsBase64, "^^^^^");
    const result = await cloudinary.uploader.upload(req.body.data, 
    //{
    //upload_preset: 'chat_default'},
    function(error, result) {console.log(result, error)}
    );
    console.log(result, "*****");
    let user = await User.findOneAndUpdate({_id: req.body._id}, {
        urlAvt: result.url
    });
    res.json(user);
  } catch(error) {
    console.log(error);
  }
}