'use strict';

var $ = require('jquery');
var greet = require('./greet'); // Require in a module that we have created
document.write(greet());          // Use the module directly
var userList = document.getElementById('userlist');  // Grab something from the DOM page


var request = require('superagent');  // bring in superagent for client-side requests

$(document).ready(function() {
  $('#newuser').on('submit', function(e) {
    e.preventDefault();
    var username = $("input[name=username]").val();
    var newUser = JSON.stringify({ username: username });

    $.post('/api/users', newUser, function(response) {
      var user = JSON.parse(response.body); // may be issue here with parse
      var newEl = document.createElement('li');
      newEl.innerHTML = 'User: '+ user.username + " #" + user._id;
      userList.appendChild(newEl);
    });
  });
});

request
  .get('/api/users')
  .end(function(err, res) {
    if (err) return console.log('Error getting users. Error: ', err);
    var users = JSON.parse(res.text); // client side doesn't have parsing built in!!
    users.forEach(function(user) {
      var userEl = document.createElement('li');  // make a li element
      userEl.innerHTML = 'User: '+ user.username + " #" + user._id;          // change the inner of the li element
      userList.appendChild(userEl);               // append the new li to the ul
    });
  });


// request
//   .post('/api/users')

//   .end(function(err, res) {
//     if (err) return console.log('Error posting to users. Error: ', err);
//     var users
//   });







