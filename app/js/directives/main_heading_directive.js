'use strict';
// simple static NON-replace directive

module.exports = function(app) {
  // use app to create new named directive
  app.directive('mainHeadingDirective', function() {
    return {
      restrict: 'AE',
      replace:  false,
      template: '<h1>Awesome H1 Heading Directive (non-replace)</h1>'
    };
  });
};
