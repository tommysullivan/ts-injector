declare var require:any;
declare var SSHClient:any;

export default class NodemiralPatch {
    applyPatch():void {
        var NodemiralSSHClient = require('nodemiral/lib/ssh');
        var NodemiralSession = require('nodemiral/lib/session');

        NodemiralSession.prototype._withSshClient = function(callback) {
            if(this._keepAlive) {
                if(!this._keepAliveClient) {
                    this._keepAliveClient = new SSHClient();
                    this._keepAliveClient.connect(this._getSshConnInfo());
                }
                callback(this._keepAliveClient, function() {});
            } else {
                var client = new NodemiralSSHClient();
                var connectInfo = this._getSshConnInfo();
                client._client.on('keyboard-interactive', function(name, instr, lang, prompts, cb) {
                    cb([connectInfo.password]);
                });
                client._client.on('ready', () => callback(client, done));
                client._client.on('error', error => {
                    if(this.onErrorHandler) this.onErrorHandler(error);
                });

                connectInfo = this._getSshConnInfo();
                connectInfo.tryKeyboard = true;
                client.connect(connectInfo);
                function done() {
                    client.close();
                }
            }
        };

        NodemiralSession.prototype.onError = function(handler) {
            this.onErrorHandler = handler;
        }
    }
}