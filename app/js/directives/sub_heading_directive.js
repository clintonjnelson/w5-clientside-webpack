'use strict';
// simple static directive with separate HTML template

module.exports = function(app) {
  app.directive('subHeadingDirective', function() {
    return {
      restrict: 'AE',
      replace: true,
      templateUrl: 'templates/sub_heading.html' // relative to APP folder
    };
  });
};
