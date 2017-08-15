/*global require,process,console*/

/**
 * Usage:
 *
 * npm install minimist express
 * node app.js [options]
 */

(function () {
    "use strict";

    var BUNDLE_FILE = 'bundles.json';
    var options = require('minimist')(process.argv.slice(2));
    var express = require('express');
    var app = express();
    require('express-ws')(app);

    var fs = require('fs');
    var request = require('request');
    var Rover = require('./rover.js');
    var RealtimeServer = require('openmct-tutorials/example-server/realtime-server');
    var HistoryServer = require('openmct-tutorials/example-server/history-server');

    var proxyUrls = [
        'http://cab.inta-csic.es/rems/wp-content/plugins/marsweather-widget/api.php'
    ];

    // Defaults
    options.port = process.env.PORT || options.port || options.p || 8080;
    options.directory = options.directory || options.D || '.';
    ['include', 'exclude', 'i', 'x'].forEach(function (opt) {
        options[opt] = options[opt] || [];
        // Make sure includes/excludes always end up as arrays
        options[opt] = Array.isArray(options[opt]) ?
                options[opt] : [options[opt]];
    });

    // Show command line options
    if (options.help || options.h) {
        console.log("\nUsage: node server.js [options]\n");
        console.log("Options:");
        console.log("  --help, -h               Show this message.");
        console.log("  --port, -p <number>      Specify port.");
        console.log("  --directory, -D <bundle>   Serve files from specified directory.");
        console.log("");
        process.exit(0);
    }

    app.use('/proxyUrl', function proxyRequest(req, res, next) {
        if (proxyUrls.indexOf(req.query.url) !== -1) {
            res.header("Access-Control-Allow-Origin", "https://nasa.github.io");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

            console.log('Proxying request to: ', req.query.url);
            req.pipe(request({
                url: req.query.url,
                strictSSL: false
            }).on('error', next)).pipe(res);
        } else {
            res.status(400).send();
        }
    });

    var spacecraft = new Rover();
    var realtime = new RealtimeServer(spacecraft);
    var history = new HistoryServer(spacecraft);
    app.use('/realtime', realtime);
    app.use('/history', history);

    // Expose everything else as static files
    app.use(express['static'](options.directory));
    // Finally, open the HTTP server
    app.listen(options.port, function () {
        console.log('Open MCT hosted at http://localhost:' + options.port);
        console.log('History hosted at http://localhost:' + options.port + '/history');
        console.log('Realtime hosted at ws://localhost:' + options.port + '/realtime');
    });
}());
