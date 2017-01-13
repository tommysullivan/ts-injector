import yargs = require("../typings/yargs");
import {frameworkForNodeJSInstance} from "../framework/nodejs/framework-for-node-js-instance";

export const command = 'send';
export const desc = 'Enhance an existing cucumber test json with cluster details and send to portal';
export const builder = {
    clusterId: {
        alias: 'c',
        type: 'string',
        demand: true,
        describe: 'clusterId for the test'
    },
    sourceFile: {
        alias: 's',
        type: 'string',
        demand: true,
        describe: 'location of the cucumber.json result file'
    },
    passed: {
        alias: 'p',
        type: 'string',
        demand: true,
        describe: 'whether or not the test passed'
    }
};

export const handler = (argv) => {
    const framework = frameworkForNodeJSInstance;
    const clusterId = argv.clusterId;
    const testRunGUID = framework.uuidGenerator.v4();
    const cucumberJSONFilePath = argv.sourceFile;
    const passed = argv.passed.toLowerCase().trim()=='true';
    const uniqueFileIdentifier = framework.nodeWrapperFactory.path.basename(cucumberJSONFilePath).replace('.json','');
    const cucumberTestResult = framework
        .cucumber
        .newCucumberResultFromFilePathWhenProcessResultUnavailable(
            cucumberJSONFilePath, passed
        );
    const urlCalculator = framework.testing.newUrlCalculator();
    urlCalculator.writeUrlToPropertiesFile(urlCalculator.calculateURL(uniqueFileIdentifier));
    framework.clusterTesting.newClusterResultPreparer()
        .prepareClusterResult(
            clusterId,
            cucumberTestResult,
            uniqueFileIdentifier,
            testRunGUID
        )
        .then(clusterTestResult =>
            framework.testing.newResultReporter().reportResult(
                uniqueFileIdentifier,
                framework.typedJSON.newJSONSerializer().serializeToString(clusterTestResult)
            )
        )
        .then(
            r => framework.console.log('Success!'),
            e => {
                framework.cli.newCliHelper().logError(e);
                framework.process.exit(1);
            }
        );
};