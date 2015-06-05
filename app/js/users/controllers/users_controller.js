'use strict';

// This gets sent into client.js for building/bundling
module.exports = function(app) {
  // Pass in $scope for view/controller interaction AND $http for hitting server
  // $scope is a service
  app.controller('usersController', ['$scope', 'RESTResource', function($scope, RESTResource) {
    var Users = RESTResource('users');
    // make a variable to share with view
    $scope.users  = [];
    $scope.errors = [];

    // make a function to share with view
    $scope.getUsers = function() {
      Users.index(function(err, users) {
        if (err) return $scope.errors.push('error getting users');
        $scope.users = users;
      });
      // REFACTOR THIS OUT VIA SERVICE
      // $http.GET('/api/users')
        // .success(function(users) { // if works, set value of shared variable
        //   $scope.users = users;
        // })
        // .error(function(err) { // if fails, set value of shared errors
        //   console.log('Error getting users: ', err);
        //   $scope.errors.push('Error getting users.');
        // });
    };

    $scope.createUser = function(user) {
      var tempUser = angular.copy(user); // make temp user in case user gets overwritten
      $scope.users.push(tempUser);                  // add user before successful
      Users.create(tempUser, function(err, data){
        if (err) {
          $scope.users.splice($scope.users.indexOf(tempUser), 1);  // remove added user that didn't work
          console.log('Error creating user: ', err);
          return $scope.errors.push("could not create new user");
        }
          $scope.users.splice($scope.users.indexOf(tempUser), 1, data);   // once created, replace temp user with final
          user.username = '';    // reset input field
      });
      // REFECTOR OUT VIA SERVICE
      // $http.post('/api/users', tempUser)            // send data to make new user
      //   .success(function(user) {
      //     $scope.users.splice($scope.users.indexOf(tempUser), 1, user);   // once created, replace temp user with final
      //     $scope.newUser = null;    // reset input field
      //   })
      //   .error(function(err) {
      //     $scope.users.splice($scope.users.indexOf(tempUser), 1);  // remove added user that didn't work
      //     console.log('Error creating user: ', err);
      //     $scope.errors.push("could not create new user");
      //   });
    };

    $scope.destroyUser = function(user) {
      var delUserTemp = angular.copy(user);
      var indTemp = $scope.users.indexOf(user);
      $scope.users.splice(indTemp, 1);
      Users.destroy(user, function(err, data) {
          if(err || !data.success) {
            $scope.users.splice(indTemp, 0, delUserTemp);
            $scope.errors.push('could not delete user');
            console.log('User could not be removed');
            if(err) {return console.log('Server error removing user: ', err);}
          }
      });
      // REFACTOR THIS OUT VIA SERVICE
      // $http.delete('/api/users/' + user._id)
      //   .success(function(data) {
      //     if (!data.success) {
      //       $scope.users.splice(indTemp, 0, delUserTemp);
      //       $scope.errors.push('could not delete user');
      //       return console.log('User could not be removed');
      //     }
      //   })
      //   .error(function(err) {
      //     console.log('Server error removing user: ', err);
      //     $scope.errors.push("could not delete user")
      //   });
    };

    $scope.editUser = function(user) {
      user.editing = true;
      user.temp = angular.copy(user);
    };

    $scope.cancelEdit = function(user) {
      user.editing = false;
      user = user.temp;
      user.temp = null;
    };

    $scope.updateUser = function(user) {
      user.editing = false;
      Users.update(user, function(err, data) {
        if (err) {
          $scope.errors.push('could not update user');
          $scope.users.splice($scope.users.indexOf(user), 1, user.temp);
          delete user.temp;
          return console.log(err);
        }
        delete user.temp;
        console.log('update successful');
      });
      // REFACTOR THIS OUT VIA SERVICE
      // $http.patch(('/api/users/' + user._id), user)
      //   .success(function() {
      //     console.log('update successful');
      //     delete user.temp;
      //   })
      //   .error(function(err) {
      //     $scope.errors.push('could not update user');
      //     $scope.users.splice($scope.users.indexOf(user), 1, user.temp);
      //     delete user.temp;
      //     console.log(err);
      //   });
    };

    $scope.clearErrors = function() {
      $scope.errors = [];
    };
  }]);
};
