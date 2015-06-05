'use strict';
// this is a simple directive that uses the parent scope
// it is looped into each user. No flexibility in the directive for use other than user deletion.

module.exports = function(app) {
  app.directive('deleteUserButtonDirective', function(){
    return {
      restrict: 'AE',
      replace: true,
      templateUrl: 'js/users/directives/delete_user_button.html'
    };
  });
};
