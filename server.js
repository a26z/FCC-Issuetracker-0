'use strict';

process.env.NODE_ENV = 'test';

var express = require('express');
var bodyParser = require('body-parser');
var expect = require('chai').expect;
var cors = require('cors');
var MongoClient = require('mongodb');

var apiRoutes = require('./routes/api.js');
var fccTestingRoutes = require('./routes/fcctesting.js');
var runner = require('./test-runner');

var app = express();

app.use('/public', express.static(process.cwd() + '/public'));

app.use(cors({
    origin: '*'
})); //For FCC testing purposes only

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

//Sample front-end
app.route('/:project/')
    .get(function(req, res) {
        res.sendFile(process.cwd() + '/views/issue.html');
    });

//Index page (static HTML)
app.route('/')
    .get(function(req, res) {
        res.sendFile(process.cwd() + '/views/index.html');
    });

//For FCC testing purposes
fccTestingRoutes(app);

//Routing for API
apiRoutes(app);

// Start DB (just db, no collection yet)
const URI = process.env.URI || 'mongodb://localhost:27017';
const DB = process.env.DB || 'issuetracker'
MongoClient.connect(URI, {
    useUnifiedTopology: true
}, (err, client) => {
    if (err) throw err;
    let db = client.db(DB);
    app.locals.db = db;
    console.log("DB", DB, "Connected.")
});

//Start our server and tests!
app.listen(process.env.PORT || 3000, function() {
    console.log("Listening on port " + process.env.PORT);
    if (process.env.NODE_ENV === 'test') {
        console.log('Running Tests...');
        setTimeout(function() {
            try {
                runner.run();
            } catch (e) {
                var error = e;
                console.log('Tests are not valid:');
                console.log(error);
            }
        }, 3500);
    }
});

//404 Not Found Middleware
app.use(function(req, res, next) {
    res.status(404)
        .type('text')
        .send('Not Found');
});

module.exports = app; //for testing
