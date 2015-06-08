'use strict';

module.exports = function(app) {
  //// Helper/Handler Methods OUTSIDE the Final Factory Method Below
  //// These RETURN a function loaded with callback

  // return varying loaded versions of helper
  var handleSuccess = function(callback) {
    return function(data) {
      callback(null, data);
    };
  };
  // return varying loaded versions of helper
  var handleError = function(callback) {
    return function(err) {
      console.log(err);
      callback(err, null);
    };
  };

  // create named factory with $http dependency injected for use
  app.factory('RESTResource', ['$http', '$cookies', function($http, $cookies){
    // load library with resource
    return function(resourceName) {
      // Get the cookie & set it in header before hitting the SB
      var eat = $cookies.get('eat');              // get cookie from storage
      $http.defaults.headers.common['eat'] = eat; // put it in header

      // return library. Inject helper functions into before returning.
      return {
        // show: ,
        create: function(resourceData, callback) {
          $http.post(('/api/' + resourceName), resourceData)
            .success(handleSuccess(callback))
            .error(handleError(callback));
        },
        index: function(callback) {
          $http.get('/api/' + resourceName)
            .success(handleSuccess(callback))
            .error(handleError(callback));
        },
        update: function(resourceData, callback) {
          $http.patch(('/api/' + resourceName + '/' + resourceData._id), resourceData)
            .success(handleSuccess(callback))
            .error(handleError(callback));
        },
        destroy: function(resourceData, callback) {
          $http.delete('/api/' + resourceName + '/' + resourceData._id)
            .success(handleSuccess(callback))
            .error(handleError(callback));
        }
      };
    };
  }]);
};
