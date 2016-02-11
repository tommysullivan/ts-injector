module.exports = function(api, express, path, http) {
    var expressApplication;
    return {
        startServer: function(hostname, httpPort) {
            return api.newPromise((resolve, reject) => {
                var expressApplication = express();
                try {
                    expressApplication.set('port', httpPort);
                    expressApplication.use(express.static(path.join(__dirname, '/static-web-content')));
                    http.createServer(expressApplication).listen(
                        httpPort,
                        hostname,
                        () => resolve('Test Portal available at http://'+hostname+':'+httpPort)
                    );
                }
                catch(e) {
                    console.log('error starting server: '+ e.toString());
                    reject(e);
                }
            });
        },
        stopServer: function() {
            expressApplication
        }
    }
}