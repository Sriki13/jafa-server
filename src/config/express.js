const bodyParser = require('body-parser');
const express = require('express');

const config = require('./index');
const api = require('../api/router');
const jwt = require('../_helpers/jwt');
const errorHandler = require('../_helpers/error-handler');

function configure(app) {
    /** Body parser */
    app.use(bodyParser.urlencoded({extended: false}));
    app.use(bodyParser.json());
    app.use(jwt());

    /** prevent CORS failures for this test */
    app.use(function (req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
        next();
    });

    /** Apidoc */
    app.use('/apidoc', express.static('apidoc'));

    /** Set-up routes */
    api(app);

    app.use(errorHandler);

    /**  App configuration. */
    app.set('port', config.port);
    return app;
}

module.exports = {
    configure
};
