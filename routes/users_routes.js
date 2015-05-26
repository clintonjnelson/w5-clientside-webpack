'use strict';

var User = require('../models/User'); // Require in model
var bodyparser = require('body-parser');

// setup function to export; takes express router
module.exports = function(router) {
  router.use(bodyparser.json());  // api will receive JSON


  // R: get user (see user info)
  router.get('/users/:username', function(req, res) {
    var username = req.params.username;  // // BODY EMPTY, PARAMS HAS: username
    User.find({'username': username}, function(err, data) {  // lookup in db
      if (err) {  // handle error - conole it, vague message user
        console.log(err);
        return res.status(500).json( {msg: 'internal server error'} );
      }

      res.json(data);  // send raw data to user
    });  // look in user model
  });

  // C: create user
  router.post('/users', function(req, res) {
    // get passed info from req.body & use mongoose to crate a new 'Thing'
    var newUser = new User(req.body);  // assumes formatting of body is proper
    newUser.save(function(err, data) {  //
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

      res.json(data);
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
  router.delete('/users/:id', function(req, res) {
    User.remove({'_id': req.params.id}, function(err, data) {
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








