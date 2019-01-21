const http = require('http');
const co = require('co');
const express = require('express');
const mongoose = require('mongoose');

const {configure} = require('./config/express');

let app;
let server;

/**
 * Start the web app.
 *
 * @returns {Promise} when app end to start
 */
async function start() {
    if (app) {
        return app;
    }
    app = configure(express());

    const port = app.get('port');
    server = http.createServer(app);
    await server.listen(port);
    console.log(`✔ Server running on port ${port}`);

    let host = "ds159624.mlab.com";
    let credentials = {};

    if (process.env.JAFA_DB_USER !== undefined) {
        credentials.password = process.env.JAFA_DB_PASSWORD;
        credentials.user = process.env.JAFA_DB_USER;
    } else {
        credentials = require("./credentials");
    }

    mongoose.connect("mongodb://" + credentials.user + ":" + credentials.password + "@" + host + ":59624/jafa");

    const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function () {
        console.log("Connection to DB successful");
    });

    return app;
}

/**
 * Stop the web app.
 *
 * @returns {Promise} when app end to start
 */
async function stop() {
    if (server) {
        await server.close();
        server = null;
        app = null;
    }
    return Promise.resolve();
}

if (!module.parent) {
    co(start);
}

module.exports = {
    start,
    stop,
    get server() {
        return server;
    },
    get app() {
        return app;
    }
};
