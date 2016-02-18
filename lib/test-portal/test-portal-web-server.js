module.exports = function(api, express, path, http, fs, fullyQualifiedResultsPath) {
    var testResultsWebPath = '/test-results/';
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
                    expressApplication.get(testResultsWebPath, function(req, res) {
                        var fileNames = fs.readdirSync(fullyQualifiedResultsPath)
                        var fileDescriptors = fileNames.map(fileName => {
                            var fullPath = path.joinFilePath(fullyQualifiedResultsPath, fileName);
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
                    expressApplication.get(`${testResultsWebPath}:resultId`, function(req, res) {
                        var resultId = req.params.resultId;
                        var jsonPath = path.joinFilePath(fullyQualifiedResultsPath, `${req.params.resultId}.json`);
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