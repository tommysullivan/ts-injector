module.exports = function(api, ssh2Client) {
    return {
        connect: function(host, username, password) {
            return api.newPromise((resolve, reject) => {
                var connectionOptions = {
                    host: host,
                    port: 22,
                    username: username,
                    password: password,
                    tryKeyboard: true,
                }
                ssh2Client.on('keyboard-interactive', (name, instr, lang, prompts, cb) => {
                    cb([password]);
                });
                ssh2Client.on('ready', () => {
                    resolve(api.newSSHSession(ssh2Client));
                });
                ssh2Client.connect(connectionOptions);
            });
        }
    }
}