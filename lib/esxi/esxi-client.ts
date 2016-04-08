import IThenable from "../promise/i-thenable";
import ISSHSession from "../ssh/i-ssh-session";
import IList from "../collections/i-list";
import IESXIClient from "./i-esxi-client";
import ICollections from "../collections/i-collections";
import ISSHResult from "../ssh/i-ssh-result";
import ISSHAPI from "../ssh/i-ssh-api";

export default class ESXIClient implements IESXIClient {
    private sshAPI:ISSHAPI;
    private host:string;
    private username:string;
    private password:string;
    private collections:ICollections;
    private vmId:number;

    constructor(sshAPI:ISSHAPI, host:string, username:string, password:string, collections:ICollections, vmId:number) {
        this.sshAPI = sshAPI;
        this.host = host;
        this.username = username;
        this.password = password;
        this.collections = collections;
        this.vmId = vmId;
    }

    private getSSHSession():IThenable<ISSHSession> {
        return this.sshAPI.newSSHClient().connect(this.host, this.username, this.password);
    }

    private executeCommand(command):IThenable<ISSHResult> {
        return this.getSSHSession().then(sshSession => sshSession.executeCommand(command));
    }

    restoreSnapshot(snapshotID:number):IThenable<ISSHResult> {
        return this.executeCommand(`vim-cmd vmsvc/snapshot.revert ${this.vmId} ${snapshotID} 0`);
    }

    removeSnapshot(snapshotID:number):IThenable<ISSHResult> {
        return this.executeCommand(`vim-cmd vmsvc/snapshot.remove ${this.vmId} ${snapshotID}`);
    }

    captureStateAsSnapshot(snapshotName:string):IThenable<IList<ISSHResult>> {
        var commands = this.collections.newList([
            `vim-cmd vmsvc/snapshot.create ${this.vmId} ${snapshotName}`,
            `vim-cmd vmsvc/get.snapshotinfo ${this.vmId}`
        ]);
        return this.getSSHSession()
            .then(sshSession=>sshSession.executeCommands(commands));
    }

    snapshotInfo():IThenable<ISSHResult> {
        var command =  `vim-cmd vmsvc/get.snapshotinfo ${this.vmId}`;
        return this.getSSHSession()
            .then(sshSession=>sshSession.executeCommand(command));
    }

    powerOn():IThenable<ISSHResult> {
        return this.executeCommand(`vim-cmd vmsvc/power.on ${this.vmId}`);
    }

    powerReset():IThenable<IList<ISSHResult>>{
        return this.getSSHSession().then(sshSession => sshSession.executeCommands(
            this.collections.newList<string>([
                `vim-cmd vmsvc/power.off ${this.vmId}`,
                `vim-cmd vmsvc/power.on ${this.vmId}`
            ])
        ));
    }

    powerOff():IThenable<ISSHResult>{
        return this.executeCommand(`vim-cmd vmsvc/power.off ${this.vmId}`);
    }
}