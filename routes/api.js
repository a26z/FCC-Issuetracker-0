/*
 *
 *
 *       Complete the API routing below
 *
 *
 */

'use strict';

var expect = require('chai').expect;

const {
    getProject,
    postIssue,
    updateIssue,
    deleteIssue
} = require('../controllers')

module.exports = function(app) {

    app.route('/api/issues/:project')

        .get(getProject)

        .post(postIssue)

        .put(updateIssue)

        .delete(deleteIssue);

};
