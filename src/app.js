const http = require('http');
const co = require('co');
const express = require('express');

const {configure} = require('./config/express');
const MongoClient = require('mongodb').MongoClient;

let app;
let server;
let mongoDatabase;

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

    let url = "mongodb://" + credentials + host + ":" + mongoPort + "/" + mongoName;

    MongoClient.connect(url).then(db => {
        mongoDatabase = db.db(mongoName);
    }).then(() => {
        console.log("Connection to DB successful");
    }).catch(e => {
        throw e;
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
    mongoDatabase.close();
    return Promise.resolve();
}

function getDatabase() {
    return mongoDatabase;
}

if (!module.parent) {
    co(start);
}

module.exports = {
    start,
    stop,
    getDatabase,
    get server() {
        return server;
    },
    get app() {
        return app;
    }
};
