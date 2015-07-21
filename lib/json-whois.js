var notFound, simplenet, punycode, whoisCommands, authorities;

punycode = require('punycode');

simplenet = require('./simplenet');

authorities = require('./rules/authorities');

notFound = require('./rules/not-found');

whoisCommands = require('./rules/commands');

whoisParsers = require('./rules/parsers');

module.exports = function (domain, callback) {
    var availabilityCheck, command, parser, domainParts, domainPunycode, tld, whoisServer;
    if (domain === '') {
        return callback(new Error('domain must not be empty'));
    }
    domainPunycode = punycode.toASCII(domain);
    domainParts = domainPunycode.split('.');
    tld = domainParts[domainParts.length - 1];
    whoisServer = authorities[tld];
    if (whoisServer == null) {
        return callback(new Error("no whois server for tld " + tld));
    }
    availabilityCheck = notFound[whoisServer];
    if (availabilityCheck == null) {
        return callback(new Error("no check for availability for whois server " + whoisServer));
    }
    command = whoisCommands[whoisServer] || function (x) {
        return x;
    };

    parser = whoisParsers[whoisServer] || whoisParsers['_'];

    return simplenet.whois(whoisServer, command(domainPunycode), function (err, response) {
        var isAvailable;
        if (err != null) {
            return callback(err);
        }
        isAvailable = -1 !== response.indexOf(availabilityCheck);

        return callback(null, parser(response), isAvailable);
    });
};
