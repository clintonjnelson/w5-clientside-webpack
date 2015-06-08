'use strict';

module.exports = function(app) {
  // use dependencies loaded into the app
  app.factory('auth', ['$http', '$base64', '$cookies', function($http, $base64, $cookies) {

    // handlers to clean up code by loading functions with callbacks
    var authSuccessHandler = function(callback) {
      return function(data) {
        $cookies.put('eat', data.eat);  // Load cookie on success
        callback(null);                 // Callback for ERRORS ONLY
      };
    }
    var authErrorHandler = function(callback) {
      return function(data) {
        callback(data);                // Callback for ERRORS ONLY
      }
    }

    // return library of functions for auth
    return {
      signIn: function(user, callback) {
        // encode base64 for Basic authentication via passport
        var encoded = $base64.encode(user.email + ':' + user.password);
        // hit login route & pass encoded auth info in header authorization key
        $http.get('/api/login', { headers: { 'Authorization': 'Basic ' + encoded } })
          .success(authSuccessHandler(callback))
          .error(authErrorHandler(callback));
      },
      create: function(user, callback) {
        // hit users post route & pass user object for creation
        $http.post('/api/users', user)
          .success(authSuccessHandler(callback))
          .error(authErrorHandler(callback))
      },
      logout: function() {
        $cookies.put('eat', ''); // erase client eat cookie, making length => 0
      },
      isSignedIn: function() {  // if there's a cookie, signed in.
        // FAKE COOKIE? IT WILL STILL TREAT THEM AS IF SIGNED IN.
        return !!($cookies.get('eat') && $cookies.get('eat').length)
      }
    };
  }]);
};
