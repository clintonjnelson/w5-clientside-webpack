'use strict';
// simple directive templating a form for reuse under one controller & one data variable (user)

module.exports = function(app) {
  app.directive('usersFormDirective', function() {
    return {
      restrict:     'AE',
      replace:      true,
      templateUrl:  'templates/users_form.html',
      scope: {
        saveUser:   '&',    // function name match data-save-user='myFunc(user)'
        buttonText: '=',    // processed as literal js, data as reference
        labelText:  '@',    // passing as string
        formName:   '=',    // name the form... use js
        user:       '='
      }
    };
  });
};
