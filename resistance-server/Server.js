var express = require('express');
var ParseServer = require('parse-server').ParseServer;
var app = express();

var api = new ParseServer({
    databaseURI: process.env.DATABASE_URI || 'mongodb://localhost:27017/dev', // Connection string for your MongoDB database
    cloud: './cloud/main.js', // Absolute path to your Cloud Code
    appId: 'resistance-server',
    masterKey: process.env.MASTER_KEY || 'masterKey', // Keep this key secret!
    fileKey: 'optionalFileKey',
    //serverURL: 'http://localhost:1337/parse', // Don't forget to change to https if needed
    liveQuery: {
        classNames: ['GameState']
    }
});

let port = process.env.PORT || 1337;
var mountPath = process.env.PARSE_MOUNT || '/parse';

// Serve the Parse API on the /parse URL prefix
app.use('/parse', api);

var httpServer = require('http').createServer(app);

httpServer.listen(port, function() {
    console.log('parse-server running on port ' + port + '.');
});

ParseServer.createLiveQueryServer(httpServer);
