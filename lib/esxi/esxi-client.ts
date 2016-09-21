import {IFuture} from "../promise/i-future";
import {ISSHSession} from "../ssh/i-ssh-session";
import {IList} from "../collections/i-list";
import {IESXIClient} from "./i-esxi-client";
import {ICollections} from "../collections/i-collections";
import {ISSHResult} from "../ssh/i-ssh-result";
import {ISSHAPI} from "../ssh/i-ssh-api";

export class ESXIClient implements IESXIClient {
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

    private getSSHSession():IFuture<ISSHSession> {
        return this.sshAPI.newSSHClient().connect(this.host, this.username, this.password);
    }

    private executeCommand(command):IFuture<ISSHResult> {
        return this.getSSHSession().then(sshSession => sshSession.executeCommand(command));
    }

    restoreSnapshot(snapshotID:number):IFuture<ISSHResult> {
        return this.executeCommand(`vim-cmd vmsvc/snapshot.revert ${this.vmId} ${snapshotID} 0`);
    }

    removeSnapshot(snapshotID:number):IFuture<ISSHResult> {
        return this.executeCommand(`vim-cmd vmsvc/snapshot.remove ${this.vmId} ${snapshotID}`);
    }

    captureStateAsSnapshot(snapshotName:string):IFuture<IList<ISSHResult>> {
        return this.getSSHSession()
            .then(sshSession=>sshSession.executeCommands(
                `vim-cmd vmsvc/snapshot.create ${this.vmId} ${snapshotName}`,
                `vim-cmd vmsvc/get.snapshotinfo ${this.vmId}`
            ));
    }

    snapshotInfo():IFuture<ISSHResult> {
        const command =  `vim-cmd vmsvc/get.snapshotinfo ${this.vmId}`;
        return this.getSSHSession()
            .then(sshSession=>sshSession.executeCommand(command));
    }

    powerOn():IFuture<ISSHResult> {
        return this.executeCommand(`vim-cmd vmsvc/power.on ${this.vmId}`);
    }

    powerReset():IFuture<IList<ISSHResult>>{
        return this.getSSHSession().then(sshSession => sshSession.executeCommands(
            `vim-cmd vmsvc/power.off ${this.vmId}`,
            `vim-cmd vmsvc/power.on ${this.vmId}`
        ));
    }

    powerOff():IFuture<ISSHResult>{
        return this.executeCommand(`vim-cmd vmsvc/power.off ${this.vmId}`);
    }
}