import { binding as steps, given, when, then } from "cucumber-tsflow";
import Framework from "../../lib/framework/framework";
import PromisedAssertion = Chai.PromisedAssertion;
import ISSHResult from "../../lib/ssh/i-ssh-result";
import IList from "../../lib/collections/i-list";
declare var $:Framework;
declare var module:any;

@steps()
export default class YarnSteps {
    private appId:string;
    lastCommandResultSet:IList<ISSHResult>;

    @when(/^I obtain the application id from the stdout$/)
    obtainApplicationIdFromStdout():void {
        var lineContainingAppId = this.lastCommandResultSet.last.processResult().stderrLines().firstWhere(
            l=>l.indexOf('Submitted application')>-1
        );
        var lineParts = lineContainingAppId.split(' ');
        var appId = lineParts[lineParts.length-1];
        console.log(appId);
        this.appId = appId;
        $.expect(appId).is.not.null;
    }

    @then(/^I should see logs in ElasticSearch containing the application ID when I filter by service name "([^"]*)"$/)
    verifyLogsInElasticSearchContainAppIdWhenFilteringByServiceName(serviceName:string):PromisedAssertion {
        var hitsRequest = $.clusterUnderTest.newElasticSearchClient()
            .then(es=>es.logsForServiceThatContainText(serviceName, this.appId))
            .then(result=>result.numberOfHits);
        return $.expect(hitsRequest).to.eventually.be.greaterThan(0);
    }

    @given(/^the cluster is running YARN$/)
    verifyClusterMapReduceDefaultModeIsYARN():PromisedAssertion {
        var result = $.clusterUnderTest.nodes().first().newSSHSession()
            .then(sshSession=>sshSession.executeCommand('/opt/mapr/bin/maprcli cluster mapreduce get -json'))
            .then(commandResult=>{
                var jsonString = commandResult.processResult().stdoutLines().join("");
                var json = JSON.parse(jsonString);
                return json.data[0].default_mode;
            });
        return $.expect(result).to.eventually.equal('yarn');
    }
}
module.exports=YarnSteps;