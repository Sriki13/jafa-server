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
    let credentials = "";
    let mongoPort = "59624";
    let mongoName = "jafa";

    if (process.env.JAFA_DB_USER !== undefined) {
        credentials = process.env.JAFA_DB_USER + ":" + process.env.JAFA_DB_PASSWORD + "@";
    } else {
        mongoPort = "27017";
        mongoName = "off";
        host = "localhost";
    }

    mongoose.connect("mongodb://" + credentials + host + ":" + mongoPort + "/" + mongoName);

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
