module.exports = function(api, express, path, http, fs) {
    var testResultsPath = '/test-results/';
    function normalizedPath(testResultsPath) {
        return path.join(__dirname, testResultsPath);
    }
    return {
        startServer: function(hostname, httpPort) {
            return api.newPromise((resolve, reject) => {
                var expressApplication = express();
                try {
                    expressApplication.set('port', httpPort);
                    expressApplication.use(express.static(path.join(__dirname, 'static-web-content')));
                    http.createServer(expressApplication).listen(
                        httpPort,
                        hostname,
                        () => resolve('Test Portal available at http://'+hostname+':'+httpPort)
                    );
                    expressApplication.get(testResultsPath, function(req, res) {
                        var testResultListPath = normalizedPath(testResultsPath);
                        var fileNames = fs.readdirSync(testResultListPath)
                        var fileDescriptors = fileNames.map(fileName => {
                            var fullPath = path.join(testResultListPath, fileName);
                            var urlFriendlyName = fileName.replace('.json','');
                            return {
                                name: urlFriendlyName,
                                href: urlFriendlyName,
                                fullPath: fullPath,
                                modifiedTime: fs.statSync(fullPath).mtime.getTime()
                            }
                        });
                        fileDescriptors.sort((f1, f2) => f2.modifiedTime - f1.modifiedTime);
                        res.end(JSON.stringify(fileDescriptors));
                    });
                    expressApplication.get(`${testResultsPath}:resultId`, function(req, res) {
                        var resultId = req.params.resultId;

                        var jsonPath = `${normalizedPath(testResultsPath)}${req.params.resultId}.json`;
                        var testResultJSON = require(jsonPath.toString());
                        res.end(JSON.stringify(testResultJSON));
                    });
                }
                catch(e) {
                    console.log('error starting server: '+ e.toString());
                    reject(e);
                }
            });
        }
    }
}