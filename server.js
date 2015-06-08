'use strict';

var express     = require('express');
var app         = express();            // make app/server via express
var mongoose    = require('mongoose');
var passport    = require('passport');

// Routers
var usersRouter = express.Router();     // make router
var authRouter  = express.Router();

// Setup db & host to listen
mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://localhost/users_development');
// Set Env Var (TEMP)
process.env.AUTH_SECRET = process.env.AUTH_SECRET || 'setThisVar';

// Initialize passport as middleware
app.use(passport.initialize());
// Load passport with strategy
require('./lib/passport_strategy.js')(passport);

// Require in routes from users_routes & pass usersRouter to populate
require('./routes/users_routes.js')(usersRouter         );
require('./routes/auth_routes.js' )(authRouter, passport);

// Assign base route & Router of subroutes to app
app.use('/api', authRouter );
app.use('/api', usersRouter);
app.use(express.static(__dirname + '/build')); // static resources

// Start server on env port or default 3000
app.listen(process.env.PORT || 3000, function() {
  console.log('server running on port ' + (process.env.PORT || 3000));
});









