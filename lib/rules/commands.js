module.exports = {
    'whois.verisign-grs.com': function(domain) {
        return 'domain ' + domain;
    },
    'whois.denic.de': function(domain) {
        return '-T dn,ace ' + domain;
    }
}
