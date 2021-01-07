const mongoose = require ('mongoose');


const roomSchema = new mongoose.Schema({
	name: String,
	host: String,
	members: Array,
	topMess: Object,
	update: {type: Date, default: Date.now}
})

const Room = mongoose.model('Room', roomSchema, 'rooms');
module.exports = Room;