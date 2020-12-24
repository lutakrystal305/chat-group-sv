const jwt = require("jsonwebtoken");
const md5 = require('md5');
const User = require('../models/user.model');
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
        res.json(client);
      }
    } catch (error) {
      next(error);
    }
  };
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
  };
  module.exports.create = async function (req, res, next) {
    console.log(req.body);
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
      console.log(newUser);
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
      res.json(req.body);
    }
  }