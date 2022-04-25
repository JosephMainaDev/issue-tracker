const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {

  // POST
  suite('POST to /api/issues/{projectname} to create issues', function() {
    // TEST 1
    test('POST with every field', function(done) {
      const data = {
        project: 'apitest',
        issue_title: 'new issue',
        issue_text: 'issue api test',
        created_by: 'admin',
        assigned_to: 'admin',
        status_text: 'ongoing',
        created_on: Date.now(),
        updated_on: Date.now(),
        open: true
      };

      chai
        .request(server)
        .post('/api/issues/apitest')
        .send(data)
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.isObject(res.body, 'response is an object');
          assert.containsAllKeys(
            res.body,
            data,
            'response object should include all submitted fields'
          );
          done();
        });
    });
    
    // TEST 2
    test('POST with only the required fields', function(done) {
      const data = {
        project: 'apitest',
        issue_title: 'new issue',
        issue_text: 'issue api test',
        created_by: 'admin'
      };

      const expected = {
        project: 'apitest',
        issue_title: 'new issue',
        issue_text: 'issue api test',
        created_by: 'admin',
        assigned_to: '',
        status_text: '',
        created_on: Date.now(),
        updated_on: Date.now(),
        open: true
      };

      chai
        .request(server)
        .post('/api/issues/apitest')
        .send(data)
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.isObject(res.body, 'response is an object');
          assert.containsAllKeys(
            res.body,
            expected,
            'response object should include all submitted fields'
          );
          done();
        });
    });

    // TEST 3
    test('POST with missing required fields', function(done) {
      const data = {
        project: 'apitest',
        assigned_to: 'admin',
        status_text: 'ongoing',
        created_on: Date.now(),
        updated_on: Date.now(),
        open: true
      };

      chai
        .request(server)
        .post('/api/issues/apitest')
        .send(data)
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.isObject(res.body, 'response is an object');
          assert.deepEqual(res.body, { error: 'required field(s) missing' });
          done();
        });
    });
  });


  // GET
  suite('GET /api/issues/{projectname} to view issues', function() {
    // TEST 4
    test('GET all issues', function(done) {
      const expected = {
        project: 'apitest',
        issue_title: 'new issue',
        issue_text: 'issue api test',
        created_by: 'admin',
        assigned_to: '',
        status_text: '',
        created_on: Date.now(),
        updated_on: Date.now(),
        open: true
      };
      
      chai
        .request(server)
        .get('/api/issues/apitest')
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.isArray(res.body, 'respose is an array');
          assert.containsAllKeys(
            res.body[0],
            expected,
            'all fields should be present for each issue'
          );
          done();
        });
    });

    // TEST 5
    test('GET with one filter', function(done) {
      chai
        .request(server)
        .get('/api/issues/apitest/?created_by=admin')
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.isArray(res.body, 'respose is an array');
          assert.propertyVal(
            res.body[0],
            'created_by',
            'admin',
            'response has issues with given filter'
          );
          done();
        });
    });

    // TEST 6
    test('GET with multiple filters', function(done) {
      chai
        .request(server)
        .get('/api/issues/apitest/?created_by=admin&assigned_to=admin&open=true')
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.isArray(res.body, 'respose is an array');
          assert.propertyVal(
            res.body[0],
            'created_by',
            'admin',
            'response has issues with multiple filters'
          );
          assert.propertyVal(
            res.body[0],
            'assigned_to',
            'admin',
            'response has issues with multiple filters'
          );
          assert.propertyVal(
            res.body[0],
            'open',
            true,
            'response has issues with multiple filters'
          );
          done();
        });
    });
  });


  // PUT
  suite('PUT to /api/issues/{projectname} to update issues', function() {
    // TEST 7
    test('PUT with one field', function(done) {
      let _id = '62631514002649b1171836ce';
      chai
        .request(server)
        .put('/api/issues/apitest')
        .send({
          '_id': _id,
          'open': false
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, { result: 'successfully updated', '_id': _id })
          done();
        });
    });

    // TEST 8
    test('PUT with multiple fields', function(done) {
      let _id = '62631514002649b1171836ce';
      chai
        .request(server)
        .put('/api/issues/apitest')
        .send({
          '_id': _id,
          'open': false,
          'asigned_to': 'kimani',
          'status_text': 'almost done with this'
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, { result: 'successfully updated', '_id': _id })
          done();
        });
    });

    // TEST 9
    test('PUT with missing _id', function(done) {
      chai
        .request(server)
        .put('/api/issues/apitest')
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, { error: 'missing _id' });
          done();
        });
    });

    // TEST 10
    test('PUT with no fields', function(done) {
      let _id = '626387642cae7da3d1aa846f';
      chai
        .request(server)
        .put('/api/issues/apitest')
        .send({ _id: _id })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, { error: 'no update field(s) sent', '_id': _id });
          done();
        });
    });

    // TEST 11
    test('PUT with invalid _id', function(done) {
      let _id = '626387642cae7da3d1aa8466';
      chai
        .request(server)
        .put('/api/issues/apitest')
        .send({
          '_id': _id,
          'open': false,
          'asigned_to': 'kimani',
          'status_text': 'almost done with this'
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, { error: 'could not update', '_id': _id });
          done();
        });
    });
  });


  // DELETE
  suite('DELETE issues from db at /api/issues/{projectname}', function() {
    // TEST 12
    test('DELETE an issue', function(done) {
      let _id = '6262faf5817db6bfbd59c037';
      chai
        .request(server)
        .delete(`/api/issues/apitest/?_id=${_id}`)
        .send({ _id: _id })
        .end(function(_, res) {
          assert.equal(res.status, 200);
          assert.deepEqual(
            res.body,
            {
              result: 'successfully deleted', _id: _id
            });
          done();
        });
    });

    // TEST 13
    test('DELETE with invalid _id', function(done) {
      let _id = '626314400b0f9559040f73dd';
      chai
        .request(server)
        .delete('/api/issues/apitest/')
        .send({ _id: _id })
        .end(function(_, res) {
          assert.equal(res.status, 200);
          assert.deepEqual(
            res.body,
            {
              error: 'could not delete', '_id': _id
            });
          done();
        });
    });

    // TEST 14
    test('DELETE with missing _id', function(done) {
      chai
        .request(server)
        .delete('/api/issues/apitest')
        .end(function(_, res) {
          assert.equal(res.status, 200);
          assert.deepEqual(
            res.body,
            {
              error: 'missing _id'
            });
          done();
        });
    });
  });

});
