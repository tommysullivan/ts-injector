module.exports = function(api, nodemiral) {
    return {
        connect: function(host, username, password) {
            return api.newPromiseForImmediateValue(api.newSSHSession(
                nodemiral.session(host, {username: username, password: password}, { ssh: { 'StrictHostKeyChecking': 'no' }})
            ));
        }
    }
}