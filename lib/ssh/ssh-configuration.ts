import IJSONObject from "../typed-json/i-json-object";

export default class SSHConfiguration {
    private sshConfigJSON:IJSONObject;

    constructor(sshConfigJSON:IJSONObject) {
        this.sshConfigJSON = sshConfigJSON;
    }

    get writeCommandsToStdout():boolean {
        return this.sshConfigJSON.booleanPropertyNamed('writeCommandsToStdout');
    }
}