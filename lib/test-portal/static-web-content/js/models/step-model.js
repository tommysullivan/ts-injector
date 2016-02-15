function getStepModel(stepJSON) {
    return {
        name: stepJSON.name,
        keyword: stepJSON.keyword,
        result: {
            status: stepJSON.result.status,
            errorMessage: stepJSON.result.errorMessage
        }
    }
}