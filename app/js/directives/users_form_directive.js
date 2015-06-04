'use strict';
// simple directive templating a form for reuse

module.exports = function(app) {
  app.directive('usersFormDirective', function() {
    return {
      restrict:     'AE',
      replace:      true,
      templateUrl:  'templates/users_form.html'
    };
  });
};
