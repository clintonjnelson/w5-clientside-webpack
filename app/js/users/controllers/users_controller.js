'use strict';

// This gets sent into client.js for building/bundling
module.exports = function(app) {
  // Pass in $scope for view/controller interaction AND $http for hitting server
  // $scope is a service
  app.controller('usersController', ['$scope', '$http', function($scope, $http) {
    // make a variable to share with view
    $scope.users  = [];
    $scope.errors = [];

    // make a function to share with view
    $scope.getUsers = function() {
      $http.get('/api/users')
        .success(function(users) { // if works, set value of shared variable
          $scope.users = users;
        })
        .error(function(err) { // if fails, set value of shared errors
          console.log('Error getting users: ', err);
          $scope.errors.push('Error getting users.');
        });
    };

    $scope.createUser = function() {
      $scope.users.push($scope.newUser);  // add user before successful
      $http.post('/api/users', $scope.newUser)
        .success(function(user) {
          $scope.newUser = null;    // reset input field
        })
        .error(function(err) {
          $scope.users.splice($scope.users.indexOf($scope.newUser), 1);  // remove added user that didn't work
          console.log('Error creating user: ', err);
          $scope.errors.push("could not create new user");
        });
    };

    $scope.destroyUser = function(user) {
      $scope.users.splice($scope.users.indexOf(user), 1);
      $http.delete('/api/users/' + user._id)
        .success(function(data) {
          if (!data.success) { return console.log('User could not be removed'); }
        })
        .error(function(err) {
          console.log('Server error removing user: ', err);
          $scope.errors.push("could not delete user")
        });
    };

    $scope.editUser = function(user) {
      user.editing = true;
      user.temp = angular.copy(user.username);
    };

    $scope.cancelEdit = function(user) {
      user.editing = false;
      user.username = user.temp;
      user.temp = null;
    }

    $scope.updateUser = function(user) {
      user.editing = false;
      $http.patch(('/api/users/' + user._id), user)
        .success(function() {
          console.log('update successful');
        })
        .error(function(err) {
          console.log('err');
          $scope.errors.push('could not update user')
          user.username = user.temp;
        })
    };

    $scope.clearErrors = function() {
      $scope.errors = [];
    };
  }]);
};
