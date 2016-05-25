var mongoose = require('mongoose'); //mongo connection
var Schema = mongoose.Schema;
var autoIncrement = require('mongoose-auto-increment');
var connection = mongoose.connect('mongodb://127.0.0.1:27017/pmGlobaltask');
autoIncrement.initialize(connection);
// var dbHost = (process.env.CUSTOMCONNSTR_MONGOLAB_URI);
// mongoose.connect(dbHost);

var userSchema = new Schema({ 
	firstName: { 
		type:String, 
		required:true
	},
	lastName: { 
		type: String,
		required:true
	},
  	gender: { 
  		type:String,
  		required:true
  	},
    dob: { 
    	type: Date,
    	required:true
    },
    meta: {
    	created_at: {
    		type: Date,
    		'default': Date.now,
    		set: function(val){
    			return undefined;
    		}
    	},				   
    	updated_at: {
    	type: Date,
    	'default': Date.now
    	}
    }
   
});


userSchema.plugin(autoIncrement.plugin, {model:'User', startAt:1});
var User = connection.model('User', userSchema);

userSchema.pre('save', function(next){
	if (this.isNew){
		this.meta.created_at = undefined;
	}
	this.meta.updated_at = undefined;
	next();
});

var adminSchema = new Schema({
    username:{
        type: String,
        required:true,
        unique:true
    },
    password: {
        type: String,
        required:true
    },
    admin: {
    type: Boolean,
    default: false
  }
});
var Admin = connection.model('Admin',adminSchema);


module.exports = {
   User:User,
   Admin:Admin 
};
// module.exports = User;
// module.exports = Admin;



