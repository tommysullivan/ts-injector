module.exports = function(api, connectedSSH2Client) {
    return {
        executeCommands: function(commands) {
            commands = commands.concat(['exit']);
            return api.newPromise((resolve, reject) => {
                var output = [];
                connectedSSH2Client.shell((err, stream) => {
                    if (err) reject(err);
                    else {
                        stream.on('close', () => {
                            stream.end();
                            resolve(output.join(''));
                        });
                        stream.on('data', (data) => {
                            output.push(data.toString());
                        });
                        stream.stderr.on('data', error => {
                            stream.end();
                            reject(error);
                        });
                        stream.write(commands.map(c=>c+"\n").join(''));
                        stream.end();
                    }
                });
            });
        },
        close: function() {
            connectedSSH2Client.end();
        }
    }
}