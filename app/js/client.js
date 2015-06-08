'use strict';

require('angular/angular');
require('angular-base64' );
require('angular-cookies');
require('angular-route'  );


//// App & DI's
  // ngRoute gives access to $routeProvider
var usersApp = angular.module('usersApp', ['ngRoute', 'ngCookies', 'base64']);


//// Services
require('./services/rest_resource.js')(usersApp);
require('./services/auth.js'         )(usersApp);

//// Controllers
require('./users/controllers/users_controller.js')(usersApp);
require('./auth/controllers/auth_controller.js'  )(usersApp);

//// Directives
require('./directives/page_title_directive.js'        )(usersApp);
require('./directives/main_heading_directive.js'      )(usersApp);
require('./directives/sub_heading_directive.js'       )(usersApp);
require('./directives/users_form_directive.js'        )(usersApp);
require('./directives/delete_user_button_directive.js')(usersApp);
require('./directives/logout_directive.js'            )(usersApp);


// Custom View Routes
usersApp.config(['$routeProvider', function($routeProvider) {
  $routeProvider
    .when('/users', {
      templateUrl: 'templates/views/users_index.html',
      controller:  'usersController'
    })
    .when('/signup', {
      templateUrl: 'templates/views/create_user.html',
      controller: 'authController'
    })
    .when('/signin', {
      templateUrl: 'templates/views/signin.html',
      controller: 'authController'
     })
    .when('/', {
      redirectTo: '/signin'           // if not logged in, /users redirects to /login
    })
    .otherwise({ redirectTo: '/signup' })  // if route unknown, direct home (=> or login)
}]);








/////////// PRIOR ASSIGNMENT //////////
// var $ = require('jquery');
// var greet = require('./greet'); // Require in a module that we have created
// document.write(greet());          // Use the module directly
// var userList = document.getElementById('userlist');  // Grab something from the DOM page


// var request = require('superagent');  // bring in superagent for client-side requests

// $(document).ready(function() {
//   $('#newuser').on('submit', function(e) {
//     e.preventDefault();
//     var username = $("input[name=username]").val();
//     var newUser = JSON.stringify({ username: username });

//     $.post('/api/users', newUser, function(response) {
//       var user = JSON.parse(response.body); // may be issue here with parse
//       var newEl = document.createElement('li');
//       newEl.innerHTML = 'User: '+ user.username + " #" + user._id;
//       userList.appendChild(newEl);
//     });
//   });
// });

// request
//   .get('/api/users')
//   .end(function(err, res) {
//     if (err) return console.log('Error getting users. Error: ', err);
//     var users = JSON.parse(res.text); // client side doesn't have parsing built in!!
//     users.forEach(function(user) {
//       var userEl = document.createElement('li');  // make a li element
//       userEl.innerHTML = 'User: '+ user.username + " #" + user._id;          // change the inner of the li element
//       userList.appendChild(userEl);               // append the new li to the ul
//     });
//   });


// request
//   .post('/api/users')

//   .end(function(err, res) {
//     if (err) return console.log('Error posting to users. Error: ', err);
//     var users
//   });








