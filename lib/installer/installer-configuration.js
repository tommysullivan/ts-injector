module.exports = function(api, configurationJSON, authedRestClient, installerConfigUrl) {
    var internal = {}
    internal.configurationJSON = configurationJSON;
    var setServiceEnablement = (serviceName, version, enabled) => {
        internal.configurationJSON.services[serviceName] = {
            version: version,
            enabled: enabled
        }
    }
    return {
        enableService: (serviceName, version) => setServiceEnablement(serviceName, version, true),
        disableService: (serviceName, version) => setServiceEnablement(serviceName, version, false),
        setSSHPassword: value => internal.configurationJSON.ssh_password = value,
        setClusterAdminPassword: value => internal.configurationJSON.cluster_admin_password = value,
        setSSHUsername: value => internal.configurationJSON.ssh_id = value,
        setSSHMethod: value => internal.configurationJSON.ssh_method = value,
        setLicenseType: value => internal.configurationJSON.license_type = value,
        setDisks: value => internal.configurationJSON.disks = value,
        setHosts: value => internal.configurationJSON.hosts = value,
        setClusterName: value => internal.configurationJSON.cluster_name = value,
        save: function() {
            return api.newPromise((resolve, reject) => {
                var putArgs = {
                    body: internal.configurationJSON,
                    json: true
                }
                authedRestClient.put(installerConfigUrl, putArgs)
                    .then(ignoredPutResult => authedRestClient.get(installerConfigUrl))
                    .done(
                        getResult => {
                            internal.configurationJSON = JSON.parse(getResult.body)
                            resolve(this);
                        },
                        reject
                    );
            });
        },
        toString: function() {
            return JSON.stringify(internal.configurationJSON);
        }
    }
}