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

describe('Create endpoint /users', function () {
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

describe('Populating endpoint /users', function () {
    const endpoint = '/users';
    it('should return an empty array', function (done) {
        request(app).get(endpoint)
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body).to.be.empty;

                done();
            })
        ;
    });

    it('should return 201 when creating a new user with correct data', function (done) {
        request(app).post(endpoint)
            .send(mocks.populating_users.when_empty)
            .expect(201)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body).to.have.property('firstname');
                expect(res.body).to.have.property('lastname');
                expect(res.body.firstname).to.be.equal('William');
                expect(res.body.lastname).to.be.equal('Okano');
                done();
            })
        ;
    });

    it('should return 422 when trying to create a new user with missing required data', function (done) {
        request(app).post(endpoint)
            .send(mocks.populating_users.without_required_firstname)
            .expect(422, done)
        ;
    });

    it('should return 201 when creating a second new user with correct data', function (done) {
        request(app).post(endpoint)
            .send(mocks.populating_users.second_user)
            .expect(201)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body).to.have.property('firstname');
                expect(res.body).to.have.property('lastname');
                expect(res.body.firstname).to.be.equal('Zup');
                expect(res.body.lastname).to.be.equal('IT');
                done();
            })
        ;
    });

    it('should have 2 users now', function (done) {
        request(app).get(endpoint)
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);

                expect(res.body.length).to.be.equal(2);
                expect(res.body[0].firstname).to.be.equal('William');
                expect(res.body[1].firstname).to.be.equal('Zup');

                done();
            })
        ;
    });

    it('should change the name of the first user', function (done) {
        request(app).get(endpoint)
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);

                request(app).put(`${endpoint}/${res.body[0]._id}`)
                    .send(mocks.populating_users.updating_first_user)
                    .expect(200)
                    .end((err, res) => {
                        if (err) return done(err);

                        request(app).get(endpoint)
                            .expect(200)
                            .end((err, res) => {
                                expect(res.body[0].firstname).to.be.equal('William Johnson');
                                expect(res.body[0].lastname).to.be.equal('dos Santos Okano');

                                done();
                            })
                        ;
                    })
                ;
            })
        ;
    });
});

describe('Trying to access a non-existing endpoint', function () {
    it('should return 404', function (done) {
        request(app).get('/williamokano')
            .expect(404, done)
        ;
    });
});
