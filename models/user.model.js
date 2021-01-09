const mongoose = require ('mongoose');


const userSchema = new mongoose.Schema({
	name: String,
	email: String,
    password: String,
	phone: Number,
	date: String,
	sex: {type: String, default: 'male'},
	add: String,
	urlAvt: String,
	userID: String,
    groups: Array,
	update: {type: Date, default: Date.now}
})

const User = mongoose.model('User', userSchema, 'users');
module.exports = User;