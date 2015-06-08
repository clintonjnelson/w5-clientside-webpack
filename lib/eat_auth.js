'use strict';
// token checking for easily moving around in app

var eat  = require('eat'              );
var User = require('../models/User.js');

module.exports = function(secret) {
  return function eatAuth(req, res, next) {
    var eatoken = req.headers.eat || req.body.eat || req.params.eat;
    if (!eatoken) {   // check if any token provided
      console.log('no eat provided');
      return res.status(500).json({error: 'please sign in to do that'});
    }

    eat.decode(eatoken, secret, function(err, decoded) {  // token exists, try decoding
      if (err) {
        console.log('eat was not valid format', err);
        return res.status(500).json({error: 'please sign in to do that'});
      }

      User.findOne(decoded, function(err, user) { // token decoded, try to find user
        if (err || !user || (Object.keys(user).length === 0)) {
          console.log('no user matches eat. Error: ', err);
          return res.status(500).json({error: 'please sign in to do that'});
        }

        req.user = user;  // load & pass user along
        next();
      });
    });
  };
};












