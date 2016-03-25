module.exports = function(error, nativeResponse, originalURL) {
    return {
        toString: function() {
            return JSON.stringify(this.toJSON(), null, 3);
        },
        toJSON: function() {
            var body =  this.isJSON() ? this.jsonBody() : this.body();
            return {
                originalURL: originalURL,
                type: 'rest-response',
                error: error,
                statusCode: this.statusCode(),
                body: body
            }
        },
        isError: () => error || nativeResponse.statusCode >= 400,
        body: () => (nativeResponse || {}).body,
        isJSON: function() {
            try {
                this.jsonBody();
                return true;
            }
            catch(e) {
                return false;
            }
        },
        originalUrl: () => originalURL,
        jsonBody: function() { return JSON.parse(this.body()) },
        statusCode: () => (nativeResponse || {}).statusCode
    }
}