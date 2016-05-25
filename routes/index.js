var express = require('express');
var router = express.Router();
var models = require('../models/users');



/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Log In' });
});


var admins = new models.Admin({
		username:'test',
		password:'pass1234',
	});

	admins.save(function(err,admin){
		if(err) throw err;
		
		// console.log('save successful');
	});
	models.Admin.find({}).remove({}, function(){
 console.log('purge complete');
});


router.post('/', function(req,res,next){
	if (!req.body.username || !req.body.password)
		return res.render('index', {error: "Please enter your email and password."});
		models.Admin.findOne({
		    username: req.body.username,
		    password: req.body.password
		}, function(error, user){
	    	if (error) return next(error);
	    	if (!user) return res.render('index', {
	    		error: "Incorrect email&password combination."
	    	});
	    		console.log(user);
	    		req.session.user = "test";
    			req.session.admin = true;
	    
	    	res.redirect('/users');
	  	})
});

module.exports = router;
