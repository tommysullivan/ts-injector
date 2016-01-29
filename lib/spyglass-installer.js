module.exports = function(api) {
    return {
        install: function() {
            return api.newPromise(function(resolve, reject) {
                resolve();
                //reject(new Error("Error installing Spyglass"));
            });
        }
    }
}