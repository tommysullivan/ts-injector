module.exports = function(api, configurationJSON, authedRestClient, installerConfigUrl) {
    var internal = {}
    internal.configurationJSON = configurationJSON;
    var getComponent = (componentName) => internal.configurationJSON.services[componentName];
    return {
        enableComponent: function(componentName) {
            this.componentNamed(componentName).enabled = true;
        },
        componentNamed: function(componentName) {
            var component = getComponent(componentName);
            if(component==null) throw new Error(`Could not find component in GUI Installer config. Sought name: ${componentName}, configJSON: ${this.toString()}`);
            return component;
        },
        disableComponent: function(componentName) {
            this.componentNamed(componentName).enabled = false;
        },
        save: function() {
            return api.newPromise((resolve, reject) => {
                var putArgs =  {
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