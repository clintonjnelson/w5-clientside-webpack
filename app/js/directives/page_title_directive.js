'use strict';
// simple static directive using DIV replacement (note: must be DIV or won't work!)

module.exports = function(app) {
  // first thing to do is to make a new directive through the app
  app.directive('pageTitleDirective', function() {
    return {
      restrict: 'AE',
      replace:  true,
      template: '<title> Awesome Page Title as Directive </title>'
    };
  });
};
