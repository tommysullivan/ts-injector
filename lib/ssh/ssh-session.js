module.exports = function SSHSession(api, nodemiralNativeSession, _) {
    return {
        executeCommands: function(commands) {
            return api.newPromise((resolve, reject) => {
                var results = []
                var executeNextCommand = commandsToExecute => {
                    var commandToExecute = _.first(commandsToExecute);
                    var remainingCommands = _.rest(commandsToExecute);
                    if(commandToExecute==null) return reject(new Error('Attempted to execute null command'));
                    this.executeCommand(commandToExecute)
                        .then(result => {
                            results.push(result);
                            remainingCommands.length > 0
                                ? executeNextCommand(remainingCommands)
                                : resolve(api.newShellCommandResultSet(commands, results));
                        })
                        .catch(result => {
                            results.push(result);
                            reject(api.newShellCommandResultSet(commands, results));
                        });
                }
                executeNextCommand(commands.map(i=>i));
            });
        },
        executeCommand: function(command) {
            return api.newPromise((resolve, reject) => {
                nodemiralNativeSession.execute(command, function(err, code, logs) {
                    var result = api.newShellCommandResult(command, err, code, logs.stdout, logs.stderr);
                    if(err || code!=0) reject(result);
                    else resolve(result);
                });
            });
        }
    }
}