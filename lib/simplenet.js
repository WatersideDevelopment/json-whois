"use strict";
// Move this out to a seperate library for simplenet or something?
var net = require('net');
var tcpPorts = {
    'whois':    43
};

module.exports = {
    tcpGet: function(port, hostname, request, callback) {
        var calledBack, response, sock;
        sock = net.createConnection(port, hostname);
        sock.setEncoding('utf8');
        sock.setTimeout(5000);
        sock.on('connect', function() {
            return sock.write(request);
        });
        response = '';
        calledBack = false;
        sock.on('data', function(data) {
            return response += data;
        });
        sock.on('error', function(error) {
            if (!calledBack) {
                callback(error);
            }
            return calledBack = true;
        });
        sock.on('timeout', function() {
            sock.end();
            if (!calledBack) {
                callback(new Error("request to " + hostname + ":" + port + " timed out"));
            }
            return calledBack = true;
        });
        return sock.on('close', function(hadError) {
            if (!calledBack) {
                callback(null, response);
            }
            return calledBack = true;
        });
    },
    whois: function(server, command, callback) {

        return module.exports.tcpGet(tcpPorts.whois, server, "" + command + "\r\n", callback);
    }
};
