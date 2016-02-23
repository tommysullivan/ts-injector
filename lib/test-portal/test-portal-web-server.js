module.exports = function(api, express, path, http, fs, fullyQualifiedResultsPath, bodyParser, jiraRestClient, jiraUsername, jiraPassword, _) {
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

                    function sendError(httpResponse, error) {
                        httpResponse.sendStatus(500); httpResponse.end('error: '+error);
                    }

                    expressApplication.get(testResultRoute, function(httpRequest, httpResponse) {
                        fs.createReadStream(getTestResultFilePathFromHttpRequest(httpRequest)).pipe(httpResponse);
                    });
                    expressApplication.put(testResultRoute, function(httpRequest, httpResponse) {
                        fs.writeFile(getTestResultFilePathFromHttpRequest(httpRequest), JSON.stringify(httpRequest.body), function (error) {
                            if(error) sendError(httpResponse, error);
                            else httpResponse.end('success');
                        });
                    });
                    expressApplication.post('/jqlQueries/', function(httpRequest, httpResponse) {
                        jiraRestClient.createAutheticatedSession(jiraUsername, jiraPassword).then(
                            jiraSession => {
                                console.log('httpRequest.body.jqlQuery', httpRequest.body.jqlQuery);
                                jiraSession.issueKeysForJQL(httpRequest.body.jqlQuery).done(
                                    issueKeysForJQL=>httpResponse.end(JSON.stringify({issueKeysForJQL: issueKeysForJQL})),
                                    error=>sendError(httpResponse, error)
                                )
                            },
                            error => sendError(httpResponse, error)
                        );
                    });
                    expressApplication.post('/jira-sync-requests/', function(httpRequest, httpResponse) {
                        jiraRestClient.createAutheticatedSession(jiraUsername, jiraPassword).then(
                            jiraSession => {
                                try {
                                    var issueUpdateRequests = httpRequest.body.map(issueUpdateRequest => {
                                        function summaryText(summaryJSON) {
                                            var s = summaryJSON;
                                            return `${s.type} - ${s.total} total (${s.failed} failed, ${s.passed} passed, ${s.pending} pending, ${s.notExecuted} not executed)`;
                                        }
                                        var comment = _.flatten([
                                            'Tests '+issueUpdateRequest.status,
                                            'Detail Link: '+issueUpdateRequest.testResultURL,
                                            issueUpdateRequest.summaries.map(summaryText)
                                        ]).join("\n");
                                        return jiraSession.addCommentToIssue(issueUpdateRequest.jiraKey, comment);
                                    });
                                    api.newGroupPromise(issueUpdateRequests).done(
                                        (successes) => httpResponse.end('success'),
                                        (error) => sendError(httpResponse, error)
                                    );
                                }
                                catch(error) {
                                    console.log(error);
                                    sendError(httpResponse, error.message);
                                }
                            },
                            error => sendError(httpResponse, error)
                        );
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