angular.module('testPortalApp').factory('stepModel', () => {
    return {
        fromJSON: (stepJSON) => {
            var step = {
                name: stepJSON.name,
                keyword: stepJSON.keyword,
                status: stepJSON.result.status,
                errorMessage: stepJSON.result.error_message,
                rows: stepJSON.rows
            }
            if(step.status=='skipped') step.status = 'notExecuted';
            return step;
        }
    }
});