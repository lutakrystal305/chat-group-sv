const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

module.exports = async (request, response, next) => {
    console.log(request)
    // send to client token -> post (req.body verify)
    const token = request.header('auth-token');

    
    if (!token) return response.status(401).send('Access Denied');

    try {
        const verified = jwt.verify(token, 'shhh');
        const user = await User.findOne({_id: verified._id});
        if (user) {
            next();
        } else {
            console.log(false)
        }
    } catch (err) {
        return response.status(400).send('Invalid Token');
    }
};