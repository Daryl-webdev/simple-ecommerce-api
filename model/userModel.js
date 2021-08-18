const mongoose = require('mongoose');
const { Schema } = mongoose;


let userSchema = new Schema({
	firstName: {type: String, required: true},
	lastName: {type: String, required: true},
	userName: {type: String, required: true, unique: true},
	suffix: {type: String, default: undefined },
	email: {type: String, required: true, unique: true},
	password: {type: String, required: true},
	isAdmin: {
		type: Boolean,
		default: false
	}
})

const User = mongoose.model('User', userSchema)
module.exports = User;

