'use strict';

// bring in mongoose for db management
var mongoose = require('mongoose');

// Setup schema via mongoose function
var userSchema = mongoose.Schema({
  username: String,
  email: String,
  passtoken: String,
  created_at: Date
});

// Validations
userSchema.path('username').required(true);
userSchema.path('username').index({unique: true});

// Export mongoose model with Name/schema
module.exports = mongoose.model('User', userSchema);
