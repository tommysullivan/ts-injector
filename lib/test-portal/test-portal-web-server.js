module.exports = function(api, express, path, http, fs, fullyQualifiedResultsPath, bodyParser) {
    var testResultsWebPath = '/test-results/';
    var testResultRoute = `${testResultsWebPath}:resultId`;
    return {
        startServer: function(hostname, httpPort) {
            return api.newPromise((resolve, reject) => {
                var expressApplication = express();
                try {
                    expressApplication.set('port', httpPort);
                    expressApplication.use(express.static(path.join(__dirname, 'static-web-content')));
                    expressApplication.use(bodyParser.json())

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

                    var getTestResultFilePathFromId = (resultId) => path.joinFilePath(fullyQualifiedResultsPath, `${resultId}.json`);
                    var getTestResultFilePathFromHttpRequest = (httpRequest) => getTestResultFilePathFromId(httpRequest.params.resultId);

                    expressApplication.get(testResultRoute, function(httpRequest, httpResponse) {
                        fs.createReadStream(getTestResultFilePathFromHttpRequest(httpRequest)).pipe(httpResponse);
                    });
                    expressApplication.put(testResultRoute, function(httpRequest, httpResponse) {
                        fs.writeFile(getTestResultFilePathFromHttpRequest(httpRequest), JSON.stringify(httpRequest.body), function (err) {
                            if(err) { httpResponse.sendStatus(500); httpResponse.end('error: '+err); }
                            else httpResponse.end('success');
                        });
                    })
                }
                catch(e) {
                    console.log('error starting server: '+ e.toString());
                    reject(e);
                }
            });
        }
    }
}