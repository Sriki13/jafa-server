const MongoClient = require('mongodb').MongoClient;

async function getDatabaseObject() {
    // mongodb://<dbuser>:<dbpassword>@ds159624.mlab.com:59624/jafa
    let host = (process.env.NODE_ENV === 'test')  ? "ds221645.mlab.com" : "ds159624.mlab.com";
    let credentials = "";
    let mongoPort = (process.env.NODE_ENV === 'test')  ? "21645" : "59624";
    let mongoName = (process.env.NODE_ENV === 'test') ? "jafa_test" : "jafa";

    if (process.env.JAFA_DB_USER !== undefined) {
        credentials = process.env.JAFA_DB_USER + ":" + process.env.JAFA_DB_PASSWORD + "@";
    } else {
        mongoPort = "27017";
        mongoName = "off";
        host = "localhost";
    }

    if (process.env.NODE_ENV === 'test') {
        mongoName = 'jafa_test';
    }

    let url = "mongodb://" + credentials + host + ":" + mongoPort + "/" + mongoName;
    console.log("Database url: " + url);

    let client = await MongoClient.connect(url);
    let db = await client.db(mongoName);
    console.log("Connection to DB '" + mongoName + "' succesfull");
    return db;
}

module.exports = getDatabaseObject();
