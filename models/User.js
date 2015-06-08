'use strict';

// bring in mongoose for db management
var bcrypt   = require('bcrypt-nodejs');
var eat      = require('eat'          );
var mongoose = require('mongoose'     );

// Setup schema via mongoose function
var userSchema = mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email:    { type: String, required: true, unique: true },
  basic:    {
    password: { type: String, required: true}
  },
  eat: Number,
  created_at: Date
});

// Validations
userSchema.path('username').required(true);
userSchema.path('username').index({unique: true});
userSchema.path('email'   ).index({unique: true});

userSchema.methods.generateHash = function generateHash(password, callback) {
  bcrypt.genSalt(8, function(err, salt) {
    bcrypt.hash(password, salt, null, function saveHashedPassword(err, hash) {
      if (err) {
        console.log('error generating hash: ', err);
        return callback(err, null);
      }
      callback(null, hash);
    });
  });
};

userSchema.methods.checkPassword = function checkPassword(password, callback) {
  bcrypt.compare(password, this.basic.password, function validatePassword(err, res) {
    if (err) {
      console.log('error checking password: ', err);
      return callback(err, null);
    }
    callback(null, res); // if failure, res=false; if success, res=true
  });
};

userSchema.methods.generateToken = function generateToken(secret, callback) {
  this.eat = Date.now();  // update val for new token
  this.save(function(err, user) {
    if (err) {
      console.log('error creating new token: ', err);
      return callback(err, null);
    }

    // from updated val, make new token
    eat.encode({eat: user.eat}, secret, function encodeEat(err, eatoken) {
      if (err) {
        console.log('error encoding eat: ', err);
        return callback(err, null);
      }
      callback(null, eatoken);
    });
  });
};

userSchema.methods.invalidateToken = function invalidateToken(callback) {
  this.eat = null;
  this.save(function(err, user) {
    if (err) {
      console.log('could not save invalidated token: ', err);
      return callback(err, null);
    }
    callback(null, user);
  });
};

// Export mongoose model with Name/schema
module.exports = mongoose.model('User', userSchema);
