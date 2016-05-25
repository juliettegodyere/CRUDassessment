var express = require('express');
var router = express.Router();
var mongoose = require('mongoose'); //mongo connection
var models = require('../models/users');
// var dateFormat = require('dateformat');
var bodyParser = require('body-parser'); //parses information from POST
var expressValidator = require('express-validator');
var methodOverride = require('method-override'); //used to manipulate POST


router.use(bodyParser.urlencoded({ extended: true }));
router.use(expressValidator());
router.use(methodOverride(function(req, res){
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    // look in urlencoded POST bodies and delete it
    var method = req.body._method
    delete req.body._method
    return method
  }
}));

// authorization
var authorize = function(req, res, next) {
  if (req.session && req.session.user==="test" && req.session.admin)
    return next();
  else
    return res.sendStatus(401);
};


//create user
router.get('/create', authorize,function(req, res) {
    res.render('users/create', { title: 'Add New Users' });
});

//logout
router.get('/logout', function(req, res, next) {
  req.session.destroy();
  res.redirect('/');
});

//POST a new user
router.route('/')

  //GET all users
  .get(authorize, function(req, res, next) {
    var page = req.query.page && parseInt(req.query.page, 10) || 0;
    models.User.count(function(err,count){
      if (err){
        return next(err);
      }
      var lastPage = (page + 1) * maxUsersPerPage >= count;
   
    var maxUsersPerPage = 25;
      //retrieve all blobs from Monogo
    models.User.find({}, function (err, users) {
      if (err) {
          return next(err);
      } else {
        // console.log(users);
          //respond to both HTML and JSON. JSON responses require 'Accept: application/json;' in the Request Header
          
          res.format({
              //HTML response will render the index.jade file in the views/blobs folder. We are also setting "blobs" to be an accessible variable in our jade view
            html: function(){
                res.render('users/index', {
                      title: 'All Users',
                      "users" : users,
                      "page":page,
                      "lastPage": lastPage
                  });
            },
            //JSON response will show all blobs in JSON format
            json: function(){
                res.json(infophotos);
            }
          });
        }     
    })
    .sort( { _id : 1 } )
    .skip(page * maxUsersPerPage)
    .limit(maxUsersPerPage);
  });
  })

   // Get values from POST request. These can be done through forms or REST calls. These rely on the "name" attributes for forms 
  .post(function(req, res,next) {
    //Express-validator
  req.checkBody(
      "firstName",
      "firstName can not be empty"
      ).notEmpty();
      req.checkBody(
      "lastName",
      "lastName can not be empty"
      ).notEmpty();
      req.checkBody(
      "gender",
      "Gender can not be empty"
      ).notEmpty();
      req.checkBody(
      "dob",
      "DOB can not be empty"
      ).notEmpty();

  var firstName = req.body.firstName;
  var lastName = req.body.lastName;
  var gender = req.body.gender;
  var dob = req.body.dob;

  //call the create function for our database
  var user = new models.User({
  	firstName:firstName,
  	lastName:lastName,
  	gender:gender,
  	dob:dob,
    
   
  });

   
 var errors = req.validationErrors();
 if (errors){
  // console.log(errors);
   res.render('users/create', {
    "errors": errors
  });
 } else {
    user.save( function (err, user) {
      if (err) {
        res.redirect("/users/create");

      } else {
      //User has been created
        console.log('POST creating new user: ' + user);

        res.format({
            //HTML response will set the location and redirect back to the home page. You could also create a 'success' page if that's your thing
          html: function(){
              // If it worked, set the header so the address bar doesn't still say /adduser
              res.location("users");

              // And forward to success page
              res.redirect("/users");
          },
          //JSON response will show the newly created user
          json: function(){

              res.json(user);
          }
        });
      }
  });
 }
 
});

// route middleware to validate :id
router.param('id', function(req, res, next, id) {
  //console.log('validating ' + id + ' exists');
  //find the ID in the Database
  models.User.findById(id, function (err, user) {
    //if it isn't found, we are going to repond with 404
    if (err) {
      console.log(id + ' was not found');
      res.status(404)
      var err = new Error('Not Found');
      err.status = 404;
      res.format({
        html: function(){
            next(err);
         },
        json: function(){
               res.json({message : err.status  + ' ' + err});
         }
      });
    //if it is found we continue on
    } else {
        //uncomment this next line if you want to see every JSON document response for every GET/PUT/DELETE call
        //console.log(blob);
        // once validation is done save the new item in the req
        req.id = id;
        // go to the next thing
        next(); 
      } 
  });
});

router.route('/:id')
  .get(authorize, function(req, res) {
    models.User.findById(req.id, function (err, user) {
      if (err) {
        console.log('GET Error: There was a problem retrieving: ' + err);
      } else {
        console.log('GET Retrieving ID: ' + user._id);
        var dob = new Date();
        var blobdob = user.dob.toISOString();
        blobdob = blobdob.substring(0, blobdob.indexOf('T'))
        res.format({
          html: function(){
              res.render('users/show', {
                "blobdob" : blobdob,
                "user" : user
              });
          },
          json: function(){
              res.json(user);
          }
        });
      }
    });
  });

router.route('/:id/edit')
	//GET the individual blob by Mongo ID
	.get(authorize, function(req, res) {
    //search for the blob within Mongo
    models.User.findById(req.id, function (err, user) {
      if (err) {
          console.log('GET Error: There was a problem retrieving: ' + err);
      } else {
          //Return the blob
          console.log('GET Retrieving ID: ' + user._id);

          var dob = new Date();
          var blobdob = user.dob.toISOString();
          blobdob = blobdob.substring(0, blobdob.indexOf('T'))
          res.format({
            //HTML response will render the 'edit.jade' template
            html: function(){
              res.render('users/edit', {
                title: 'User' + user._id,
                "blobdob" : blobdob,
                "user" : user
              });
            },
             //JSON response will return the JSON output
            json: function(){
              res.json(user);
            }
          });
        }
	 });
	})

//PUT to update a blob by ID
router.put('/:id/edit', function(req, res) {
  // Get our REST or form values. These rely on the "name" attributes
  var firstName = req.body.firstName;
  var lastName = req.body.lastName;
  var gender = req.body.gender;
  var dob = req.body.dob;

  //find the document by ID
  models.User.findById(req.id, function (err, user) {
      //update it
      user.update({
          firstName : firstName,
          lastName : lastName,
          gender : gender,
          dob : dob
      }, function (err, userID) {
        if (err) {
            res.send("There was a problem updating the information to the database: " + err);
        } 
        else {
                //HTML responds by going back to the page or you can be fancy and create a new view that shows a success page.
                res.format({
                    html: function(){
                         res.redirect("/users/" + user._id);
                   },
                   //JSON responds showing the updated values
                  json: function(){
                         res.json(user);
                   }
                });
         }
      })
  });
});

router.route('/:id/delete')
  .get(authorize, function(req, res) {
    models.User.findById(req.id, function (err, user) {
      if (err) {
        console.log('GET Error: There was a problem retrieving: ' + err);
      } else {
        console.log('GET Retrieving ID: ' + user._id);
        var dob = new Date();
        var blobdob = user.dob.toISOString();
        blobdob = blobdob.substring(0, blobdob.indexOf('T'))
        res.format({
          html: function(){
              res.render('users/delete', {
                "blobdob" : blobdob,
                "user" : user
              });
          },
          json: function(){
              res.json(user);
          }
        });
      }
    });
  });





//DELETE a Blob by ID
router.delete('/:id/delete', function (req, res){
    //find blob by ID
   models.User.findById(req.id, function (err, user) {
        if (err) {
            return console.error(err);
        } else {
            //remove it from Mongo
            user.remove(function (err, user) {
                if (err) {
                    return console.error(err);
                } else {
                    //Returning success messages saying it was deleted
                    console.log('DELETE removing ID: ' + user._id);
                    res.format({
                        //HTML returns us back to the main page, or you can create a success page
                          html: function(){
                               res.redirect("/users/");
                         },
                         //JSON returns the item with the message that is has been deleted
                        json: function(){
                               res.json({message : 'deleted',
                                   user : user
                               });
                         }
                      });
                }
            });
        }
    });
});



// //Select all user and sort by firstName
// router.get('/:filter_field', function(req, res) {
    
//       //retrieve all users from MonogoDB
//     models.User.find(req.query, function (err, docs) {
//       if (err) {
//           return next(err);
//       } else {
//         res.send(docs);
//         console.log(docs);
//         }     
//   }).sort({firstName:1});
// })



// User.find({firstName:'maria'}, function(user){
//  console.log(user);
// });

// User.find({}).remove({}, function(){
//  console.log('purge complete');
// });


module.exports = router;

