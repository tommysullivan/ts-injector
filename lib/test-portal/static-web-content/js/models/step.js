angular.module('testPortalApp').factory('stepModel', function() {
    function StepModel(stepJSON, parentScenario) {
        var resultContainer =  stepJSON.result || stepJSON;
        var status = resultContainer.status=='skipped' ? 'notExecuted' :  resultContainer.status;
        return {
            name: stepJSON.name,
            keyword: stepJSON.keyword,
            status: status == 'undefined' || status == undefined ? 'notExecuted' : status,
            isManual: false,
            docString: stepJSON.doc_string ? stepJSON.doc_string.value.split("\n").join("<br />") : null,
            errorMessage: resultContainer.error_message || resultContainer.errorMessage,
            rows: stepJSON.rows,
            toJSON: function() {
                return {
                    name: this.name,
                    keyword: this.keyword,
                    status: this.status,
                    errorMessage: this.errorMessage,
                    rows: this.rows
                }
            }
        }
    }
    return {
        fromJSON: StepModel
    }
});