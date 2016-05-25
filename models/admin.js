var mongoose = require('mongoose'); //mongo connection
var Schema = mongoose.Schema;
var User = require('../models/users');

var adminSchema = new Schema({
	username:{
		type: String,
		required:true
	},
	password: {
		type: String,
		required:true
	}
});

var Admin = mongoose.model('Admin',adminSchema);

module.exports = Admin;