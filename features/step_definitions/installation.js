module.exports = function() {
    this.When(/^I run the Spyglass installer$/, function (callback) {
        // Write code here that turns the phrase above into concrete actions
        callback.pending();
    });

    this.Given(/^I subsequently run the health check described by "([^"]*)"$/, function (arg1, callback) {
        // Write code here that turns the phrase above into concrete actions
        callback.pending();
    });

    this.Then(/^the health check passes$/, function (callback) {
        // Write code here that turns the phrase above into concrete actions
        callback.pending();
    });

    this.Given(/^I have installed Spyglass onto "([^"]*)"$/, function (operatingSystem, callback) {
        var hostNamesByOS = {
            'CentOS 7': '10.10.101.106',
            'Ubuntu 12.04': '10.10.10.173'
        }
        if(Object.keys(hostNamesByOS).indexOf(operatingSystem) >=0) {
            var hostName = hostNamesByOS[operatingSystem];
            this.grafanaHostAndOptionalPort = 'http://' + hostName + ':3000';
            this.kibanaHostAndOptionalPort = 'http://' + hostName + ':5601';
            this.elasticSearchHostAndOptionalPort = 'http://' + hostName + ':9200';
            this.mcsProtocolHostAndOptionalPort = 'https://' + hostName + ':8443';
            this.openTSDBHostAndPort = 'http://' + hostName + ':4242';
            this.fqdns = ['' + hostName + ''];
            callback();
        }
        else callback.pending();
    });

}