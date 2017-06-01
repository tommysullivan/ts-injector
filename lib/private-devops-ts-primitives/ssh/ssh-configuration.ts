import {IJSONObject} from "../typed-json/i-json-object";
import {ISSHConfiguration} from "./i-ssh-configuration";

export class SSHConfiguration implements ISSHConfiguration {
    private sshConfigJSON:IJSONObject;

    constructor(sshConfigJSON:IJSONObject) {
        this.sshConfigJSON = sshConfigJSON;
    }

    get writeCommandsToStdout():boolean {
        return this.sshConfigJSON.booleanPropertyNamed('writeCommandsToStdout');
    }

    get temporaryStorageLocation():string {
        return this.sshConfigJSON.stringPropertyNamed('temporaryStorageLocation');
    }
}