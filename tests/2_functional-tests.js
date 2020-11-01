/*
 *
 *
 *       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
 *       -----[Keep the tests in the same order!]-----
 *       (if additional are added, keep them at the very end!)
 */


var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

const ObjectId = require('mongodb').ObjectID;

chai.use(chaiHttp);

suite('Functional Tests', function() {

    suite('POST /api/issues/{project} => object with issue data', function() {
        test('Every field filled in', function(done) {
            chai.request(server)
                .post('/api/issues/test')
                .send({
                    _id: 'beefbabebeef',
                    issue_title: 'Title',
                    issue_text: 'text',
                    created_by: 'Functional Test - Every field filled in',
                    assigned_to: 'Chai and Mocha',
                    status_text: 'In QA'
                })
                .end(function(err, res) {
                    assert.equal(res.status, 200, 'Status should be 200');
                    assert.equal(res.type, 'application/json', "Response should be json")
                    assert.property(res.body.ops[0], '_id');
                    assert.property(res.body.ops[0], 'issue_title');
                    assert.property(res.body.ops[0], 'issue_text', );
                    assert.property(res.body.ops[0], 'created_by');
                    assert.property(res.body.ops[0], 'assigned_to');
                    assert.property(res.body.ops[0], 'status_text');
                    assert.equal(res.body.ops[0]._id, 'beefbabebeef');
                    assert.equal(res.body.ops[0].issue_title, 'Title');
                    assert.equal(res.body.ops[0].issue_text, 'text');
                    assert.equal(res.body.ops[0].created_by, 'Functional Test - Every field filled in');
                    assert.equal(res.body.ops[0].assigned_to, 'Chai and Mocha');
                    assert.equal(res.body.ops[0].status_text, 'In QA');
                    assert.isBoolean(res.body.ops[0].open);
                    assert.isTrue(res.body.ops[0].open);
                    done();
                });
        });

        test('Required fields filled in', function(done) {
            chai.request(server)
                .post('/api/issues/test')
                .send({
                    issue_title: 'Good afternoon',
                    issue_text: 'It\'s been raining all weekend in Bremen',
                    created_by: 'Christian Schmidt',
                    assigned_to: 'Otto'
                })
                .end(function(err, res) {
                    assert.equal(res.status, 200);
                    assert.property(res.body.ops[0], 'issue_title');
                    assert.property(res.body.ops[0], 'issue_text', );
                    assert.property(res.body.ops[0], 'created_by');
                    assert.equal(res.body.ops[0].issue_title, 'Good afternoon');
                    assert.equal(res.body.ops[0].issue_text, 'It\'s been raining all weekend in Bremen');
                    assert.equal(res.body.ops[0].created_by, 'Christian Schmidt');
                    done();
                })
        });

        test('Missing required fields', function(done) {
            chai.request(server)
                .post('/api/issues/test')
                .send({
                    issue_title: 'Saturday afternoon',
                    created_by: 'Christian Schmidt'
                })
                .end(function(err, res) {
                    if (err) {
                        console.error(err)
                    }
                    assert.equal(res.body.name, 'MongoError')
                    assert.equal(res.body.code, 121)
                    done()
                })
        });
    });

    suite('PUT /api/issues/{project} => text', function() {

        test('No body', function(done) {
            chai.request(server)
                .put('/api/issues/test')
                .send({})
                .end(function(err, res) {
                    if (err) console.log(err);
                    assert.equal(res.body, "no updated field sent")
                    done();
                })
        });

        test('One field to update', function(done) {
            chai.request(server)
                .put('/api/issues/test')
                .send({
                    _id: 'beefbabebeef',
                    issue_title: 'Document tested'
                })
                .end(function(err, res) {
                    if (err) console.log(err);
                    assert.equal(res.body, "successfully updated ")
                    done();
                })

        });
        //
        test('Multiple fields to update', function(done) {
            chai.request(server)
                .put('/api/issues/test')
                .send({
                    _id: 'beefbabebeef',
                    issue_title: 'Document tested',
                    issue_text: 'Two fields updated here.'
                })
                .end(function(err, res) {
                    if (err) console.log(err);
                    assert.equal(res.body, "successfully updated ")
                    done();
                })
        });

    });

    suite('GET /api/issues/{project} => Array of objects with issue data', function() {

        test('No filter', function(done) {
            chai.request(server)
                .get('/api/issues/test')
                .query({})
                .end(function(err, res) {
                    assert.equal(res.status, 200);
                    assert.isArray(res.body);
                    assert.property(res.body[0], 'issue_title');
                    assert.property(res.body[0], 'issue_text');
                    assert.property(res.body[0], 'created_on');
                    assert.property(res.body[0], 'updated_on');
                    assert.property(res.body[0], 'created_by');
                    assert.property(res.body[0], 'assigned_to');
                    assert.property(res.body[0], 'open');
                    assert.property(res.body[0], 'status_text');
                    assert.property(res.body[0], '_id');
                    done();
                });
        });

        test('One filter', function(done) {
            chai.request(server)
                .get('/api/issues/test')
                .query({
                    assigned_to: 'Chai and Mocha'
                })
                .end(function(err, res) {
                    assert.equal(res.status, 200);
                    assert.isArray(res.body);
                    assert.property(res.body[0], 'assigned_to');
                    assert.equal(res.body[0].assigned_to, 'Chai and Mocha');
                    done();
                });
        });

        test('Multiple filters (test for multiple fields you know will be in the db for a return)', function(done) {
            chai.request(server)
                .get('/api/issues/test')
                .query({
                    assigned_to: 'Otto',
                    created_by: 'Christian Schmidt'
                })
                .end(function(err, res) {
                    assert.equal(res.status, 200);
                    assert.isArray(res.body);
                    assert.property(res.body[0], 'assigned_to');
                    assert.property(res.body[0], 'created_by');
                    assert.equal(res.body[0].assigned_to, 'Otto');
                    assert.equal(res.body[0].created_by, 'Christian Schmidt');
                    done();
                });

        });

    });

    suite('DELETE /api/issues/{project} => text', function() {

        test('No _id', function(done) {
            chai.request(server)
                .delete('/api/issues/test')
                .send({
                    _id: ''
                })
                .end(function(err, res) {
                    assert.equal(res.status, 418)
                    assert.equal(res.text, 'id error')
                    done()
                })
        });

        test('Valid _id', function(done) {
            chai.request(server)
                .delete('/api/issues/test')
                .send({
                    _id: 'beefbabebeef'
                })
                .end(function(err, res) {
                    assert.equal(res.status, 200)
                    assert.equal(res.body, 'deleted beefbabebeef')
                    done()
                })
        });

    });

});
