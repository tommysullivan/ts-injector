angular.module('testPortalApp').factory('stepModel', () => {
    return {
        fromJSON: (stepJSON) => {
            return {
                name: stepJSON.name,
                keyword: stepJSON.keyword,
                status: stepJSON.result.status,
                errorMessage: stepJSON.result.error_message
            }
        }
    }
});