const bodyParser = require('body-parser');
const express = require('express');

const config = require('./index');
const api = require('../api/router');

function configure(app) {
    /** Body parser */
    app.use(bodyParser.urlencoded({extended: false}));
    app.use(bodyParser.json());

    /** prevent CORS failures for this test */
    app.use(function (req, res, next) {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
        next();
    });

    /** Apidoc */
    app.use('/apidoc', express.static('apidoc'));

    /** Set-up routes */
    api(app);

    /**  App configuration. */
    app.set('port', config.port);
    return app;
}

module.exports = {
    configure
};
