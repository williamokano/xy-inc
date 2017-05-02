const request = require('supertest');
const expect  = require('chai').expect;
const app     = require('../src/app');
const db      = app.get('db');
const mocks   = require('./mocks.json');

describe("Reset database", function () {
    it("Should reset the database before the tests", function (done) {
        db.connection.db.dropDatabase()
            .then(() => done())
            .catch(err => fail('Failed to drop database '.err))
        ;
    });
});

describe('Application is running', function () {
    it('should return 404 for the home route', function (done) {
        request(app)
            .get('/')
            .expect(404)
            .end(() => {
                done();
            });
    });
});

describe('Create endpoints /users', function () {
    it('should return empty when fetching endpoints for the first time', function (done) {
        request(app).get('/entity')
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body).to.be.empty;
                done();
            })
        ;
    });

    it('should create an entity /users', function (done) {
        request(app)
            .post('/entity')
            .send(mocks.create_users)
            .expect(201)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body).to.have.property('entity');
                expect(res.body).to.have.property('fields');
                expect(res.body.entity).to.be.equal('users');
                done();
            })
        ;
    });

    it('should now return an array with 1 entity', function (done) {
        request(app).get('/entity')
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body).to.not.be.empty;
                expect(res.body[0]).to.have.property('entity');
                expect(res.body[0].entity).to.be.equal('users');
                done();
            })
        ;
    });
});
