module.exports = function(authorizedRestClientAsPromised) {
    return {
        newRequest: function() {
            return authorizedRestClientAsPromised;
        }
    }
}