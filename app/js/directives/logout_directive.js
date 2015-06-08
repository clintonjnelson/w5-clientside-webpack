'use strict';
// inline HTML & Controller for Logout directive Insertion

module.exports = function(app) {
  app.directive('logoutDirective', function() {
    return {
      restrict:   'AE',
      replace:    true,                 // replace div wherever called
      scope:      {},                   // isolate scope, so no inheritance (acts independently)
      template:   '<div data-ng-show="signedIn()"><button type="button" data-ng-click="signOut()"> logout </button></div>',
      controller: ['$scope', '$location', 'auth', function($scope, $location, auth) {
        $scope.signedIn = function() {  // check for signin
          return auth.isSignedIn();     // check for cookie via auth; return value
        };

        $scope.signOut = function() {
          auth.logout();                // remove user's cookie via auth function
          $location.path('/signin');    // redirect to home after signout
        };
      }]
    };
  });
};
