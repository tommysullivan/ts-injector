import Framework from "../../lib/framework/framework";
import ISSHSession from "../../lib/ssh/i-ssh-session";
import INodeUnderTest from "../../lib/cluster-testing/i-node-under-test";
import ISSHResult from "../../lib/ssh/i-ssh-result";
import ISSHError from "../../lib/ssh/i-ssh-error";
declare var $:Framework;
declare var module:any;

module.exports = function() {

    this.When(/^I perform the following ssh commands on each node in the cluster:$/, { timeout: 5 * 60 * 1000 }, function(commands:string) {
        var commandList = $.collections.newList(commands.split("\n"));
        return $.expect($.clusterUnderTest.executeShellCommandsOnEachNode(commandList))
            .to.eventually.be.fulfilled;
    });

    this.When(/^I ssh into the node hosting "([^"]*)"$/, function (serviceName) {
        this.sshServiceHost = $.clusterUnderTest.nodeHosting(serviceName);
        var sshSessionRequest = this.sshServiceHost.newSSHSession()
            .then(sshSession => this.sshSession = sshSession);
        return $.expect(sshSessionRequest).to.eventually.be.fulfilled;
    });

    this.When(/^within my ssh session, I download "([^"]*)" to "([^"]*)" from the repository for the "([^"]*)" component family/, function (fileToRetrieve, destinationDirectory, componentFamily) {
        var sshSession:ISSHSession = this.sshSession;
        var sshServiceHost:INodeUnderTest = this.sshServiceHost;
        var commands = $.collections.newList<string>([
            `curl ${sshServiceHost.repoUrlFor(componentFamily)}${fileToRetrieve} > ${destinationDirectory}${fileToRetrieve}`,
            `chmod 744 ${destinationDirectory}${fileToRetrieve}`
        ]);
        return $.expect(sshSession.executeCommands(commands)).to.eventually.be.fulfilled;
    });

    this.When(/^within my ssh session, I execute "([^"]*)"$/, { timeout: 10 * 60 * 1000 }, function (sshCommand) {
        var sshSession:ISSHSession = this.sshSession;
        var sshServiceHost:INodeUnderTest = this.sshServiceHost;
        sshCommand = sshCommand.replace('[installerRepoURL]', sshServiceHost.repoUrlFor('installer'));
        sshCommand = sshCommand.replace('[maprCoreRepoURL]', sshServiceHost.repoUrlFor('core'));
        sshCommand = sshCommand.replace('[ecosystemRepoURL]', sshServiceHost.repoUrlFor('ecosystem'));
        var sshRequest = sshSession.executeCommand(sshCommand)
            .then(result=>this.sshResult=result)
            .catch((e:ISSHError)=>{
                console.log(e.toJSON());
                throw new Error(e.toString());
            });
        return $.expect(sshRequest).to.eventually.be.fulfilled;
    });

    this.Then(/^it successfully starts the installer web server and outputs its URL to the screen$/, function () {
        var sshResult:ISSHResult = this.sshResult;
        var sshOutput = sshResult.processResult().stdoutLines().join('');
        $.expect(
            sshOutput.indexOf(
                'To continue installing MapR software, open the following URL in a web browser'
            )
        ).not.to.equal(-1);
    });

    this.Given(/^the cluster is running YARN$/, function () {
        var result = $.clusterUnderTest.nodes().first().newSSHSession()
            .then(sshSession=>sshSession.executeCommand('/opt/mapr/bin/maprcli cluster mapreduce get -json'))
            .then(commandResult=>{
                var jsonString = commandResult.processResult().stdoutLines().join("");
                var json = JSON.parse(jsonString);
                return json.data[0].default_mode;
            });
        return $.expect(result).to.eventually.equal('yarn');
    });

    this.When(/^I run the following commands on any given node in the cluster:$/, function (commandsString) {
        var commands = $.collections.newList<string>(commandsString.split("\n"));
        commands = commands.map(c=>c.replace('{testRunGUID}', $.testRunGUID).replace('{volumeMountPoint}', this.mountPath));
        var result = $.clusterUnderTest.nodes().first().newSSHSession()
            .then(sshSession=>sshSession.executeCommands(commands))
            .then(commandResultSet=>this.lastCommandResultSet = commandResultSet);
        return $.expect(result).to.eventually.be.fulfilled;
    });

    this.When(/^I scp "([^"]*)" to "([^"]*)" on each node in the cluster$/, function (localPath, remotePath) {
        var result = $.clusterUnderTest.uploadToEachNode(localPath, remotePath);
        return $.expect(result).to.eventually.to.fulfilled;
    });
    
    this.Then(/^I get the clusterName$/, function () {
        var result = $.clusterUnderTest.nodes().first().newSSHSession()
            .then(sshSession=>sshSession.executeCommand('/opt/mapr/bin/maprcli dashboard info -json'))
            .then(commandResult=> {
                var jsonString = commandResult.processResult().stdoutLines().join("");
                var json = JSON.parse(jsonString);
                var clusterName=json.data[0].cluster.name;
                $.expect(clusterName).is.not.null;
                console.log(clusterName);
                this.clustName=clusterName;
            });
        return $.expect(result).to.eventually.be.fulfilled;
    });

    this.Given(/^A volume called "([^"]*)"is created$/, function (volumeNameTemplate) {
        this.volumeName=volumeNameTemplate.replace('{testRunGUID}', $.testRunGUID);
        var command = "/opt/mapr/bin/maprcli volume create -name " + this.volumeName + " -json"
        console.log(command);
        var result = $.clusterUnderTest.nodes().first().newSSHSession()
            .then(sshSession=>sshSession.executeCommand(command))
            .then(commandResult=> {
                var jsonString = commandResult.processResult().stdoutLines().join("");
                var json = JSON.parse(jsonString);
                var status = json.status;
                console.log(status)
                $.expect(status).contain("OK");

            });
        return $.expect(result).to.eventually.be.fulfilled;
    });

    this.Given(/^The volume is mounted$/, function (){
        this.mountPath="/"+this.volumeName;
        console.log("MountPath is "+this.mountPath);
        var command="/opt/mapr/bin/maprcli volume mount -cluster "+this.clustName+" -name "+this.volumeName+" -path "+this.mountPath+" -json";
        console.log(command);
        var result = $.clusterUnderTest.nodes().first().newSSHSession()
        .then(sshSession=>sshSession.executeCommand(command))
            .then(commandResult=> {
                var jsonString = commandResult.processResult().stdoutLines().join("");
                var json = JSON.parse(jsonString);
                var status = json.status;
                console.log(status)
                $.expect(status).contain("OK");

            });
        return $.expect(result).to.eventually.be.fulfilled;
    });

    this.Given(/^I set the volume quota to "([^"]*)"$/, function (quota) {
        var command= "/opt/mapr/bin/maprcli volume modify -cluster "+this.clustName+ " -name "+ this.volumeName+"  -quota " +quota +" -json";
        console.log(command);
        var result = $.clusterUnderTest.nodes().first().newSSHSession()
            .then(sshSession=>sshSession.executeCommand(command))
            .then(commandResult=> {
                var jsonString = commandResult.processResult().stdoutLines().join("");
                var json = JSON.parse(jsonString);
                var status = json.status;
                console.log(status)
                $.expect(status).contain("OK");

            });
        return $.expect(result).to.eventually.be.fulfilled;
    });

    this.Given(/^I turn off compression on the volume$/, function () {
    });

    this.Given(/^I create a snapshot for the volume$/, function () {
        this.snapshot=this.volumeName+"_snapshot";
        var command="/opt/mapr/bin/maprcli volume snapshot create -cluster "+this.clustName+" -snapshotname "+this.snapshot+ " -volume "+this.volumeName +" -json";
        console.log(command);
        var result = $.clusterUnderTest.nodes().first().newSSHSession()
            .then(sshSession=>sshSession.executeCommand(command))
            .then(commandResult=> {
                var jsonString = commandResult.processResult().stdoutLines().join("");
                var json = JSON.parse(jsonString);
                var status = json.status;
                console.log(status)
                $.expect(status).contain("OK");

            });
        return $.expect(result).to.eventually.be.fulfilled;
    });

    this.Then(/^I get the expected value using maprcli volume info command$/, function (){
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
    });
}