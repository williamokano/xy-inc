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
            .expect(404, done)
        ;
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
                expect(res.body.length).to.be.equal(1);

                request(app).get(`/entity/${res.body[0]._id}`)
                    .expect(200, done)
                ;
            })
        ;
    });

    it('should return 404 for a non-existing entity', function (done) {
        request(app).get('/entity/32165498712a')
            .expect(404, done)
        ;
    });

    it('should be able to create a second entity', function (done) {
        request(app).post('/entity')
            .send(mocks.create_test_entity)
            .expect(201, done)
        ;
    });

    it('shoult now have 2 entities', function (done) {
        request(app).get('/entity')
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);

                expect(res.body.length).to.be.equal(2);
                done();
            })
        ;
    });

    it('should be able to update an entity', function (done) {
        request(app).get('/entity')
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);

                request(app).put(`/entity/${res.body[1]._id}`)
                    .send(mocks.update_test_entity)
                    .expect(200, done)
                ;
            })
        ;
    });

    it('should not be able to update a non-existing entity', function (done) {
        request(app).get('/entity')
            .expect(200)
            .end((err) => {
                if (err) return done(err);

                request(app).put('/entity/32123')
                    .send(mocks.update_test_entity)
                    .expect(404, done)
                ;
            })
        ;
    });

    it('should not be able to find a non-existing entity', function (done) {
        request(app).get('/entity/32132211')
            .expect(404, done)
        ;
    });

    it('should be able to delete an entity', function (done) {
        request(app).get('/entity')
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);

                request(app).delete(`/entity/${res.body[1]._id}`)
                    .expect(204, done)
                ;
            })
        ;
    });

    it('shoult now have 1 entities', function (done) {
        request(app).get('/entity')
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);

                expect(res.body.length).to.be.equal(1);
                done();
            })
        ;
    });
});

describe('Trying to create an entity with the name entity', function () {
    const endpoint = '/entity';
    it('should return 422, since it is not allowed to create with this name', function (done) {
        request(app).post(endpoint)
            .send(mocks.create_entity_entity)
            .expect(422, done)
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
                                if (err) return done(err);

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

    it('should delete the second user', function (done) {
        request(app).get(endpoint)
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);

                request(app).delete(`${endpoint}/${res.body[1]._id}`)
                    .expect(204)
                    .end((err) => {
                        if (err) return done(err);

                        request(app).get(endpoint)
                            .expect(200)
                            .end((err, res) => {
                                if (err) return done(err);

                                expect(res.body[0].firstname).to.be.equal('William Johnson');
                                expect(res.body[0].lastname).to.be.equal('dos Santos Okano');

                                expect(res.body.length).to.be.equal(1);

                                done();
                            })
                        ;
                    })
                ;
            })
        ;
    });

    it('should be able to find a resource by id', function (done) {
        request(app).get(endpoint)
            .expect(200)
            .end((err, initialRes) => {
                if (err) return done(err);

                request(app).get(`${endpoint}/${initialRes.body[0]._id}`)
                    .expect(200)
                    .end((err, res) => {
                        if (err) return done(err);

                        expect(res.body).to.have.property('firstname');
                        expect(res.body).to.have.property('lastname');
                        expect(res.body).to.have.property('age');
                        expect(res.body.firstname).to.be.equal('William Johnson');
                        expect(res.body.lastname).to.be.equal('dos Santos Okano');
                        expect(res.body.firstname).to.be.equal(initialRes.body[0].firstname);
                        expect(res.body.lastname).to.be.equal(initialRes.body[0].lastname);

                        done();
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
