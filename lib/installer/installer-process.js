module.exports = function(api, processJSON, authedRestClient, processURL, installerPollingFrequencyMS) {
    function performStateChange(stateChange, successState) {
        return api.newPromise((resolve, reject) => {
            authedRestClient.patch(processURL, {
                body: { state: stateChange },
                json: true
            });
            var checkOutcome = () => {
                authedRestClient.get(processURL).then(
                    result => {
                        var state = result.jsonBody().state;
                        if(state == stateChange)
                            setTimeout(checkOutcome, installerPollingFrequencyMS);
                        else {
                            if(state==successState) resolve();
                            else reject();
                        }
                    }
                )
            }
            setTimeout(checkOutcome, installerPollingFrequencyMS);
        });
    }
    return {
        validate: () => performStateChange('CHECKING', 'CHECKED'),
        provision: () => performStateChange('PROVISIONING', 'PROVISIONED'),
        install: () => performStateChange('INSTALLING', 'INSTALLED'),
        log: () => {
            var httpOptions = {
                headers: {
                    'Accept': 'text/plain'
                }
            }
            return authedRestClient.get(processJSON.links.log, httpOptions)
                .then(response=>response.body());
        }
    }
}