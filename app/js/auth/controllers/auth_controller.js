'use strict';
// This Controller will Handle User Create & Signin

module.exports = function(app) {
  // load controller with $location, auth service, and usual $scope
  app.controller('authController', ['$scope', '$location', 'auth', function($scope, $location, auth) {
    // first check if signed-in already. If so, redirect somewhere
    if (auth.isSignedIn()) { $location.path('/users'); } // redirect home instead

    // else, signup or signin depending on variables avail
    $scope.errors = [];

    // function to handle User creation OR signin for submitButton
    $scope.authSubmit = function(user) {
      if (user.password_confirmation) {    // if password_confirm key, Create User
        // Create User
        auth.create(user, function(err) {  // use auth service function to hit server
          if (err) {
            console.log('error creating user: ', err);
            return $scope.errors.push({msg: 'could not create new user'});
          }
          $location.path('/notes'); // if creation worked, auth loads cookie, so redirect
        });
      } else {
        // Sign In User
        auth.signIn(user, function(err) {
          if (err) {
            console.log('error signing in', err);
            return $scope.errors.push({msg: 'could not sign in user'});
          }
          $location.path('/notes');  // if creation worked, auth loads cookie, so redirect
        });
      }
    };
  }]);
};






