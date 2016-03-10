module.exports = function(api, requestor, baseUrl) {
    return {
        post: function(path, options) {
            return this.request(requestor.post, path, options);
        },
        get: function(path, options) {
            return this.request(requestor.get, path, options);
        },
        patch: function(path, options) {
            return this.request(requestor.patch, path, options);
        },
        delete: function(path, options) {
            return this.request(requestor.delete, path, options);
        },
        put: function(path, options) {
            return this.request(requestor.put, path, options);
        },
        request: function(method, path, options) {
            var url = path.indexOf('://')>=0 ? path : baseUrl + path;
            return api.newPromise(function(resolve, reject) {
                method.call(requestor, url, options, function(error, response, body) {
                    if(error) reject(error);
                    else {
                        if(response.statusCode >= 400) reject(response);
                        else resolve(response);
                    }
                });
            });
        }
    }
}