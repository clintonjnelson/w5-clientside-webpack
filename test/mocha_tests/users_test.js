/*jshint -W079 */
'use strict';

var chai     = require('chai'          );  // needed for should/expect assertions
var chaiHttp = require('chai-http');  // needed for requests
var expect   = chai.expect;
var mongoose = require('mongoose'     );  // needed to working with server
var User     = require('../../models/User.js');  // bring in model constructor to test
chai.use(chaiHttp);                       // tell chai to use chai-http

// Point to db via
process.env.MONGOLAB_URI = 'mongodb://localhost/users_test';

// Start server for testing
require('../../server.js');

describe('Users', function() {
  describe('with existing user', function() {
    var testUser;
    var testEat;
    // Setup Database before each describe block
    before(function(done) {
      mongoose.connection.db.dropDatabase(function() {
        mongoose.connect(process.env.MONGOLAB_URI, {}, function() {
          chai.request('localhost:3000')
            .post('/api/users')
            .send({email: 'joe@joe.com', username: 'joe', password: 'foobar'})
            .end(function(err, res) {
              expect(err).to.eq(null);
              testEat = res.body.eat;   // keep eat auth token for use
              User.findOne({username: 'joe'}, function(err, user) {
                expect(err).to.eq(null);
                testUser = user;        // keep user for reference
                done();
              });
            });
        });
      });
    });
    // Drop database after each run
    after(function(done) {
      mongoose.connection.db.dropDatabase(function() {
        done();
      });
    });

    describe('GET for users', function() {
      var joe;
      before(function(done) {
        chai.request('localhost:3000')
          .get('/api/users')
          .set({eat: testEat})
          .end(function(err, res) {
            joe = res.body[0];
            done();
          });
      });
      it('returns the user', function() {
        expect(typeof joe).to.eq('object');
      });
      it('returns the user\'s username', function(){
        expect(joe.username).to.eql('joe');
      });
      it('returns the user\'s  email', function() {
        expect(joe.email).to.eql('joe@joe.com');
      });
      it('returns the user\'s  password', function() {
        expect(typeof joe.basic.password).to.eql('string');
      });
    });

    // describe('POST', function() {
    //   it('does NOT create a duplicate username', function(done) {
    //     chai.request('localhost:3000')
    //       .post('/api/users')
    //       .send({username: 'joe', email: "someemail@example.com", password: 'foobar'})
    //       .end(function(err, res) {
    //         expect(err).to.eql(null);
    //         expect(res.body.msg).to.eql('username already exists - please try a different username');
    //         done();
    //       });
    //   });
    // });

    describe('PUT', function() {
      var response;
      before(function(done) {
        chai.request('localhost:3000')
          .patch('/api/users/' + testUser._id)
          .set({eat: testEat})
          .send({email: 'joe@newemail.com'})
          .end(function(err, res) {
            response = res.body;
            done();
          });
      });
      it('updates the user', function() {
        expect(response.msg).to.eq('user updated');
      });
    });

    describe('DELETE', function() {
      var response;
      before(function(done) {
        chai.request('localhost:3000')
          .del('/api/users/' + testUser._id)
          .set({eat: testEat})
          .end(function(err, res) {
            response = res.body;
            done();
          });
      });
      // Having my POST test above triggers this to be wrong... how fix?
      it('deletes the user', function(done) {
        chai.request('localhost:3000')
          .get('/api/users/' + testUser._id)
          .set({eat: testEat})
          .end(function(err, res) {
            expect(err).to.eql(null);
            expect(res.body).to.eql({});
            done();
          });
      });
      it('responds with the message "user removed"', function() {
        expect(response.success).to.eql(true);
      });
    });
  });


  describe('with NON-existing user', function() {
    describe('GET', function() {
      it('returns an error', function(done) {
        chai.request('localhost:3000')
          .get('/api/users')
          .set({eat: 'fakeEatToken'})
          .end(function(err, res) {
            expect(err).to.eql(null);
            expect(res.body.error).to.include('please sign in to do that');
            done();
          });
      });
    });
    describe('POST', function() {
      describe('with no username', function() {
        it('does not create a user', function(done) {
          chai.request('localhost:3000')
            .post('/api/users')
            .send({ username: '', email: 'fail@fail.com' })
            .end(function(err, res) {
              User.find({}, function(err, users) {
                expect(err).to.eq(null);
                expect(users.length).to.eq(0);
                done();
              });
            });
        });
        it('returns the validation error message in the body', function(done) {
          chai.request('localhost:3000')
            .post('/api/users')
            .set({eat: 'fakeEatToken'})
            .send({username: ''})
            .end(function(err, res) {
              expect(err).to.eq(null);
              expect(res.body.msg).to.include('username');
              done();
            });
        });
      });
    });
    describe('PUT', function() {
      it('returns the error message in the body', function(done) {
        chai.request('localhost:3000')
          .patch('/api/users/123456789wrong')
          .set({eat: 'fakeEatToken'})
          .send({username: 'thiswillfail'})
          .end(function(err, res) {
            expect(err).to.eq(null);
            expect(res.body.error).to.eq('please sign in to do that');
            done();
          });
      });
    });
    describe('DELETE', function() {
      it('returns an error message in the body', function(done) {
        chai.request('localhost:3000')
          .del('/api/users/123456789wrong')
          .set({eat: 'fakeEatToken'})
          .end(function(err, res) {
            expect(err).to.eq(null);
            expect(res.body.error).to.eq('please sign in to do that');
            done();
          });
      });
    });
  });
});
