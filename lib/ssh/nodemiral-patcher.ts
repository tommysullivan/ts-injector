declare const require:any;
declare const SSHClient:any;

export class NodemiralPatcher {
    applyPatch():void {
        const NodemiralSSHClient = require('nodemiral/lib/ssh');
        const NodemiralSession = require('nodemiral/lib/session');

        NodemiralSession.prototype._withSshClient = function(callback) {
            if(this._keepAlive) {
                if(!this._keepAliveClient) {
                    this._keepAliveClient = new SSHClient();
                    this._keepAliveClient.connect(this._getSshConnInfo());
                }
                callback(this._keepAliveClient, function() {});
            } else {
                const client = new NodemiralSSHClient();
                var connectInfo = this._getSshConnInfo();
                client._client.on('keyboard-interactive', function(name, instr, lang, prompts, cb) {
                    cb([connectInfo.password]);
                });
                client._client.on('ready', () => callback(client, () => client.close()));
                client._client.on('error', error => {
                    if(this.onErrorHandler) this.onErrorHandler(error);
                });

                connectInfo = this._getSshConnInfo();
                connectInfo.tryKeyboard = true;
                client.connect(connectInfo);
            }
        };

        NodemiralSession.prototype.onError = function(handler) {
            this.onErrorHandler = handler;
        }
    }
}