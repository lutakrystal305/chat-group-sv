const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

module.exports.verify = async function (req, res, next) {
    //console.log(req.headers);
    const token = req.headers.authorization;
    if (!token) {
      return;
    } else {
      const verified = jwt.verify(token, "shhh");
      const user = await User.findOne({_id: verified._id});
      if (user) {
        next();
      } else {
        console.log(false);
        return;
      }
    }
  };