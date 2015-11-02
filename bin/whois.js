#!/usr/bin/env node
'use strict';

var jsonwhois = require('../lib/json-whois');

// Set env var for ORIGINAL cwd
// before anything touches it
process.env.INIT_CWD = process.cwd();

var callback = function(err, json, isAvailable) {
	return isAvailable;
};

return jsonwhois(process.argv[2], callback);
