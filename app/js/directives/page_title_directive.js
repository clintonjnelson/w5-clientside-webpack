'use strict';

module.exports = function(app) {
  // first thing to do is to make a new directive through the app
  app.directive('pageTitleDirective', function() {
    return {
      restrict: 'AC',
      replace:  true,
      template: '<title> Awesome Page Title as Directive </title>'
    };
  });
};
