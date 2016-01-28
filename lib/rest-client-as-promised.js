module.exports = function(api, requestor, optionalCookies) {
    return {
        post: function(url, options) {
            return this.request(requestor.post, url, options);
        },
        get: function(url, options) {
            return this.request(requestor.get, url, options);
        },
        patch: function(url, options) {
            return this.request(requestor.patch, url, options);
        },
        delete: function(url, options) {
            return this.request(requestor.delete, url, options);
        },
        put: function(url, options) {
            return this.request(requestor.put, url, options);
        },
        request: function(method, url, options) {
            return api.newPromise(function(resolve, reject) {
                //TODO: Add optionalCookies to options
                method.call(requestor, url, options, function(error, response, body) {
                    if(error) reject(error);
                    else resolve(response);
                });
            });
        }
    }
}