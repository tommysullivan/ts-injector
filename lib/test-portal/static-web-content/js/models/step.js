angular.module('testPortalApp').factory('stepModel', () => {
    function StepModel(stepJSON) {
        var resultContainer =  stepJSON.result || stepJSON;
        var status = resultContainer.status=='skipped' ? 'notExecuted' :  resultContainer.status;
        return {
            name: stepJSON.name,
            keyword: stepJSON.keyword,
            status: status,
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