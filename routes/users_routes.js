'use strict';

var bodyparser = require('body-parser');
var eatAuth    = require('../lib/eat_auth.js')(process.env.AUTH_SECRET);
var User       = require('../models/User'); // Require in model

// setup function to export; takes express router
module.exports = function(router) {
  router.use(bodyparser.json());  // api will receive JSON


  // R: get users
  router.get('/users', eatAuth, function(req, res) {
    var username = req.params.username;  // // BODY EMPTY, PARAMS HAS: username
    User.find({}, function(err, users) {  // lookup in db
      if (err) {  // handle error - conole it, vague message user
        console.log(err);
        return res.status(500).json( {msg: 'internal server error'} );
      }
      res.json(users);  // send raw data to user
    });  // look in user model
  });

  // C: create user
  router.post('/users', function(req, res) {
    // get passed info from req.body & use mongoose to crate a new 'Thing'
    var newUser = new User({  // Explicitly populate to avoid exploit
      username: req.body.username,
      email:    req.body.email
    });

    newUser.generateHash(req.body.password, function(err, hash) {
      if (err) { return res.status(500).json({ error: true }); }
      newUser.basic.password = hash;

      newUser.save(function(err, user) {  //
        // Validations
        switch(true) {
          case !!(err && err.code === 11000):
            return res.json({msg: 'username already exists - please try a different username'});
          case !!(err && err.errors.username):
            return res.json( {msg: err.errors.username.message.replace("Path", '')});
          case !!err:
            console.log("INTERNAL SERVER ERROR IS:", err);
            return res.status(500).json({msg: 'internal server error'});
        }

        user.generateToken(process.env.AUTH_SECRET, function(err, eat) {
          if(err) {
            console.log(err);
            return res.status(500).json({ error: 'login' });
          }
          res.json({ eat: eat });
        });
      });
    });
  });

  // U: update user
  router.patch('/users/:id', eatAuth, function(req, res) {
    var updatedUser = req.body;
    delete updatedUser._id;   // pass option for props to ignore in update
    User.update({'_id': req.params.id}, updatedUser, function(err, data) {
      switch(true) {
        case !!(err && err.code === 11000):
          return res.status(500).json({msg: 'username already exists - please try a different username'});
        case !!(err && err.username):
          return res.status(500).json( {msg: err.username.message.replace("Path", '')} );
        case !!(err && err.name === 'CastError'):
          return res.status(500).json( {msg: 'invalid user'} );
        case !!err:
          console.log(err);
          return res.status(500).json({msg: 'internal server error'});
      }
      res.json({msg: 'user updated'});
    });
  });

  // D: destroy user
  router.delete('/users/:id?', eatAuth, function(req, res) {
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
      res.json({success: (data.result.n ? true : false)});  //returns 0 or more
    });
  });
};








