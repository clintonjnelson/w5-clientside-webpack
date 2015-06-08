'use strict';

var bodyparser = require('body-parser'    );
var eatAuth = require('../lib/eat_auth.js')(process.env.AUTH_SECRET);

module.exports = function(router, passport) {
  router.use(bodyparser.json());

  // Login
  // authenticate via middleware, then if OK will get here
  router.get('/login', passport.authenticate('basic', {session: false}), function(req, res) {
    req.user.generateToken(process.env.AUTH_SECRET, function(err, eat) {
      if(err) {
        console.log('Error logging in user. Error: ', err);
        return res.status(500).json({error: 'yarr, there be an error.'});
      }
      res.json({eat: eat});
    });
  });

  // User signout
  router.get('/logout', eatAuth, function(req, res) {
    req.user.invalidateToken(function(err, result) {
      if (err) { return res.status(500).json({ error: 'error signing out' }); }

      res.json({ success: true });
    });
  });
};








