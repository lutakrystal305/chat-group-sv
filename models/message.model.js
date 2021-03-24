const mongoose = require ('mongoose');


const messageSchema = new mongoose.Schema({
    message: String,
    img: Boolean,
    from: Object,
    to: mongoose.Types.ObjectId,
	date: {type: Date, default: Date.now}
})

const Message = mongoose.model('Message', messageSchema, 'messages');
module.exports = Message;