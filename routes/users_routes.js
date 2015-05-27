'use strict';

var User = require('../models/User'); // Require in model
var bodyparser = require('body-parser');

// setup function to export; takes express router
module.exports = function(router) {
  router.use(bodyparser.json());  // api will receive JSON


  // R: get users
  router.get('/users', function(req, res) {
    var username = req.params.username;  // // BODY EMPTY, PARAMS HAS: username
    User.find({}, function(err, users) {  // lookup in db
      if (err) {  // handle error - conole it, vague message user
        console.log(err);
        return res.status(500).json( {msg: 'internal server error'} );
      }
      console.log('User data is: ', users);
      res.json(users);  // send raw data to user
    });  // look in user model
  });

  // C: create user
  router.post('/users', function(req, res) {
    // get passed info from req.body & use mongoose to crate a new 'Thing'
    console.log('HIT THE POST WITH JQUERY', req.body);
    var newUser = new User(req.body);  // assumes formatting of body is proper
    newUser.save(function(err, user) {  //
      // Validations
      switch(true) {
        case !!(err && err.code === 11000):
          return res.json({msg: 'username already exists - please try a different username'});
        case !!(err && err.errors.username):
          return res.json( {msg: err.errors.username.message.replace("Path", '')});
        case !!err:
          console.log("INTERNAL SERVER ERROR IS:", err.errors.username.message);
          return res.status(500).json({msg: 'internal server error'});
      }

      res.json(user);
    });
  });

  // U: update user
  router.put('/users/:id', function(req, res) {
    var updatedUser = req.body;
    delete updatedUser._id;   // pass option for props to ignore in update

    User.update({'_id': req.params.id}, updatedUser, function(err, data) {
      switch(true) {
        case !!(err && err.code === 11000):
          return res.json({msg: 'username already exists - please try a different username'});
        case !!(err && err.username):
          return res.json( {msg: err.username.message.replace("Path", '')} );
        case !!(err && err.name === 'CastError'):
          return res.json( {msg: 'invalid user'} );
        case !!err:
          console.log(err);
          return res.status(500).json({msg: 'internal server error'});
      }

      res.json({msg: 'user updated'});
    });
  });

  // D: destroy user
  router.delete('/users/:id?', function(req, res) {
    var userId = req.params.id || req.body.id;
    User.remove({'_id': userId}, function(err, data) {
      switch(true) {
        case !!(err && err.name === 'CastError'):
          return res.json( {msg: 'invalid user'} );
        case !!err:
          console.log(err);
          return res.status(500).json({msg: 'internal server error'});
      }

      // To get a report back on outcome, check data.result.n
      res.json({msg: (data.result.n ? 'user removed' : 'user could not be removed')});  //returns 0 or more
    });
  });
};








