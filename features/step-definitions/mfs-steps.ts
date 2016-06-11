import { binding as steps, given, when, then } from "cucumber-tsflow";
import Framework from "../../lib/framework/framework";
import PromisedAssertion = Chai.PromisedAssertion;
declare var $:Framework;
declare var module:any;

@steps()
export default class MFSSteps {
    private snapshotSize:number;
    private quota:number;
    private logicalUsed:number;
    private totalUsed:number;
    private usedSize:number;
    private volumeName:string;
    private snapshot:string;
    private clusterName:string;
    private mountPath:string;
    private volumeNameTemplate:string;

    @when(/^I get the expected value using maprcli volume info command$/)
    getMapRCLIVolumeInfo():PromisedAssertion {
        var command="/opt/mapr/bin/maprcli volume info -name "+this.volumeName+" -json";
        var result = $.clusterUnderTest.nodes().first().newSSHSession()
            .then(sshSession=>sshSession.executeCommand(command))
            .then(commandResult=> {
                var jsonString = commandResult.processResult().stdoutLines().join("");
                var json = JSON.parse(jsonString);
                var logicalUsed=json.data[0].logicalUsed;
                var totalUsed=json.data[0].totalused;
                var usedSize=json.data[0].used;
                var quota=json.data[0].quota;
                var snapshotSize=json.data[0].snapshotused;

                this.snapshotSize=parseInt(snapshotSize);
                this.quota=parseInt(quota);
                this.logicalUsed=parseInt(logicalUsed);
                this.totalUsed=parseInt(totalUsed);
                this.usedSize=parseInt(usedSize);

            });
        return $.expect(result).to.eventually.be.fulfilled;
    }

    @when(/^I turn off compression on the volume$/)
    turnOffVolumeCompression():void {
        $.console.log('WARN: step "I turn off compression on the volume" currently does nothing');
    }

    @when(/^I create a snapshot for the volume$/)
    createVolumeSnapshot():PromisedAssertion {
        this.snapshot = `${this.volumeName}_snapshot`;
        var command = `/opt/mapr/bin/maprcli volume snapshot create -cluster ${this.clusterName} -snapshotname ${this.snapshot} -volume ${this.volumeName} -json`;
        var futureStatus = $.clusterUnderTest.nodes().first().newSSHSession()
            .then(sshSession=>sshSession.executeCommand(command))
            .then(commandResult=> {
                var jsonString = commandResult.processResult().stdoutLines().join("");
                var json = JSON.parse(jsonString);
                $.console.log(json.status);
                return json.status;
            });
        return $.expect(futureStatus).to.eventually.contain("OK");
    }

    @when(/^A volume called "([^"]*)"is created$/)
    createVolume():PromisedAssertion {
        this.volumeName = this.volumeNameTemplate.replace('{testRunGUID}', $.testRunGUID);
        var command = "/opt/mapr/bin/maprcli volume create -name " + this.volumeName + " -json";
        var futureStatus = $.clusterUnderTest.nodes().first().newSSHSession()
            .then(sshSession=>sshSession.executeCommand(command))
            .then(commandResult=> {
                var jsonString = commandResult.processResult().stdoutLines().join("");
                var json = JSON.parse(jsonString);
                $.console.log(json.status);
                return json.status;
            });
        return $.expect(futureStatus).to.eventually.contain("OK");
    }

    @when(/^The volume is mounted$/)
    mountVolume():PromisedAssertion {
        this.mountPath="/"+this.volumeName;
        var command = `/opt/mapr/bin/maprcli volume mount -cluster ${this.clusterName} -name ${this.volumeName} -path ${this.mountPath} -json`;
        var futureStatus = $.clusterUnderTest.nodes().first().newSSHSession()
            .then(sshSession=>sshSession.executeCommand(command))
            .then(commandResult=> {
                var jsonString = commandResult.processResult().stdoutLines().join("");
                var json = JSON.parse(jsonString);
                $.console.log(json.status);
                return json.status;

            });
        return $.expect(futureStatus).to.eventually.contain('OK');
    }

    @when(/^I set the volume quota to "([^"]*)"$/)
    setVolumeQuota(quota:string):PromisedAssertion {
        var command= `/opt/mapr/bin/maprcli volume modify -cluster ${this.clusterName} -name ${this.volumeName} -quota ${quota} -json`;
        var futureStatus = $.clusterUnderTest.nodes().first().newSSHSession()
            .then(sshSession=>sshSession.executeCommand(command))
            .then(commandResult=> {
                var jsonString = commandResult.processResult().stdoutLines().join("");
                var json = JSON.parse(jsonString);
                $.console.log(json.status);
                return json.status;
            });
        return $.expect(futureStatus).to.eventually.contain('OK');
    }

    @given(/^I set the mfs instance to "([^"]*)"$/)
    setMFSInstance(mfsInstances:string):PromisedAssertion {
        var futureSSHResult = $.clusterUnderTest.nodes().first().executeShellCommand(`maprcli config save -values '{"multimfs.numinstances.pernode":"${mfsInstances}}'`);
        return $.expect(futureSSHResult).to.eventually.be.fulfilled;
    }
}
module.exports = MFSSteps;