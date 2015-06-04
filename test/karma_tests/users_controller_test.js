'use strict';

require('../../app/js/client.js');  // bring in client-side bundle
require('angular-mocks');

describe('client-side users_controller', function() {
  var $ControllerConstructor;
  var $httpBackend;
  var $scope;
  var newUser      = {          username: 'unicorn', email: 'unicorn@example.com', password: 'foobar'};
  var existingUser = {_id: '1', username: 'unicorn', email: 'unicorn@example.com', password: 'foobar'};

  // setup our primary module to test on
  beforeEach(angular.mock.module('usersApp'));
  // setup a new scope & controller constructor
  beforeEach(angular.mock.inject(function($rootScope, $controller) {
    $scope                 = $rootScope.$new();            // inject passes root scope
    $ControllerConstructor = $controller; // inject passes callback a constructor
  }));

  it('can make a new controller', function() {
    var usersController = $ControllerConstructor('usersController', {$scope: $scope});
    expect(Array.isArray($scope.users )).toBe(true      );
    expect(Array.isArray($scope.errors)).toBe(true      );
    expect(typeof usersController      ).toBe('object'  );
    expect(typeof $scope.getUsers      ).toBe('function');
  });


  describe('with REST Interactions', function() {
    beforeEach(angular.mock.inject(function(_$httpBackend_){
      $httpBackend = _$httpBackend_;    // make backend mock
      $httpBackend.resetExpectations(); // avoid fallthru
      // make controller for testing
      this.usersController = $ControllerConstructor('usersController', {$scope: $scope});
    }));
    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    describe('getUsers()', function() {
      it('loads the scope correctly', function() {
        // setup mock response for request
        $httpBackend.expectGET('/api/users')
          .respond(200, [existingUser]);
        // tell controller to use function to hit the request
        $scope.getUsers();
        // tell backend to send the mock response now
        $httpBackend.flush();
        // test to see if controller handles response correctly
        expect($scope.errors.length    ).toBe(0        );
        expect($scope.users.length     ).toBe(1        );
        expect($scope.users[0].username).toBe('unicorn');
      });
    });

    describe('createUser', function() {
      it('saves the user for display before promise success', function() {
        $httpBackend.expectPOST('/api/users').respond(200, existingUser);
        $scope.newUser = newUser;
        $scope.createUser();
        // test state before flush, but after function call
        expect($scope.users.length).toBe(1);
        expect($scope.users[0]._id).toBe(undefined);
        $httpBackend.flush();
      });
      it('updates for the created user once response comes back', function() {
        $httpBackend.expectPOST('/api/users').respond(200, existingUser);
        $scope.newUser = newUser;
        $scope.createUser();
        $httpBackend.flush();
        // test state after flush
        expect($scope.users.length).toBe(1);
        expect($scope.users[0]._id).toBe('1');
      });
    });

    describe('destroyUser', function() {
      it('removes the user before promise success', function() {
        $httpBackend.expectDELETE('/api/users/' + existingUser._id)
          .respond(200, { success: true });
        $scope.users.push(existingUser);  // add placeholder user
        $scope.destroyUser(existingUser); // delete this user
        // test state before flush, but after function call
        expect($scope.users.length).toBe(0);
        // flush at end
        $httpBackend.flush();
      });
      it('pushes user/error if user could not be removed', function() {
        $httpBackend.expectDELETE('/api/users/' + existingUser._id)
          .respond(200, {success: false});
        $scope.users.push(existingUser);
        $scope.destroyUser(existingUser);  // delete this user
        $httpBackend.flush();
        expect($scope.users.length ).toBe(1);
        expect($scope.errors.length).toBe(1);
      });
    });

    describe('updateUser', function() {
      it('sets editing to false', function() {
        $scope.users.push(existingUser);
        $scope.users[0].editing = true;
        $httpBackend.expectPATCH('/api/users/' + existingUser._id)
          .respond(200, {msg: 'user updated'});
        $scope.updateUser(existingUser);
        expect($scope.users[0].editing).toBe(false);
        $httpBackend.flush();
      });
      it('keeps the user updates if successful', function() {
        var modifiedUser = {_id: '1', username: 'magic', email: 'magic@example.com', password: 'foobar'};
        $scope.users.push(modifiedUser);
        $scope.users[0].temp = existingUser;   // mimic editUser - set temp var
        $httpBackend.expectPATCH('/api/users/' + existingUser._id)
          .respond(200, {msg: 'user udpated'});
        $scope.updateUser($scope.users[0]);
        $httpBackend.flush();
        expect($scope.users[0].username).toBe('magic'            );
        expect($scope.users[0].email   ).toBe('magic@example.com');
      });
      it('sets the user back if updates were not successful', function() {
        var modifiedUser = {_id: '1', username: 'magic', email: 'magic@example.com', password: 'foobar'};
        $scope.users.push(modifiedUser);
        $scope.users[0].temp = existingUser;   // mimic editUser - set temp var
        $httpBackend.expectPATCH('/api/users/' + existingUser._id)
          .respond(500, {msg: 'internal server error'});
        $scope.updateUser($scope.users[0]); // update with modified user
        $httpBackend.flush();               // flush fail response
        expect($scope.users[0].username).toBe('unicorn'            );
        expect($scope.users[0].email   ).toBe('unicorn@example.com');
      });
      it('sets the error if unsuccessful', function() {
        var modifiedUser = {_id: '1', username: 'magic', email: 'magic@example.com', password: 'foobar'};
        $scope.users.push(modifiedUser);
        $httpBackend.expectPATCH('/api/users/' + existingUser._id)
          .respond(500, {msg: 'internal server error'});
        $scope.updateUser($scope.users[0]);
        $httpBackend.flush();
        expect($scope.errors.length).toBe(1);
      });
    });
  });


  describe('helper functions', function() {
      beforeEach(angular.mock.inject(function(_$httpBackend_){
      // make controller for testing
      this.usersController = $ControllerConstructor('usersController', {$scope: $scope});
    }));
    describe('editUser user', function() {
      it('sets the users editing to true', function() {
        $scope.users.push(existingUser);
        $scope.users[0].editing = false;  // set editing to false
        $scope.editUser(existingUser);
        expect($scope.users[0].editing).toBe(true);   // true after function
      });
    });
    describe('calcelEdit user', function() {
      it('sets the editing back to false', function() {
        $scope.users.push(existingUser);
        $scope.users[0].editing = true;   // true before function
        $scope.cancelEdit(existingUser);  // run function
        expect($scope.users[0].editing).toBe(false);   // false after function
      });
    });
    describe('clearErrors', function() {
      it('clears the errors', function() {
        $scope.errors.push('big error');
        $scope.clearErrors();
        expect($scope.errors.length).toBe(0);
      });
    });
  });
});










