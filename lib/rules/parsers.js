var changeCase = require('change-case');
var os = require('os');

var parsers = {
    'uk': function(response) {
        // Nominet parser, use this when no others are specified.
    }
}

module.exports = {
    '_': function(response) {
        // Default parser, use this when no others are specified.
        var result = {};

        var lines = response.split(os.EOL);

        lines.forEach(function(line){
            line = line.trim();

            if ( line && (line.indexOf(': ') > -1 ) ) {
                var lineParts = line.split(':');

                // greater than since lines often have more than one colon, eg values with URLS
                if ( lineParts.length >= 2 ) {
                    var keyName = changeCase.camelCase(lineParts[0]);
                    if(keyName == 'nameServer') {
                        if(typeof(result[keyName]) == 'undefined') {
                            result[keyName] = [];
                        }
                        (result[keyName]).push(lineParts.splice(1).join(':').trim());
                    } else {
                        result[keyName] = lineParts.splice(1).join(':').trim();
                    }
                }
            }

        });

        return result

    },
    'whois.madeup.nic': function(domain) {
        return '-T dn,ace ' + domain;
    }
}
