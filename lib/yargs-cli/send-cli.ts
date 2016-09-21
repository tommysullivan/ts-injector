import yargs = require("../typings/yargs");
import {NodeFrameworkLoader} from "../framework/node-framework-loader";

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
    const framework = new NodeFrameworkLoader().loadFramework();

    const clusterId = argv.clusterId;
    const uniqueFileId = argv.sourceFile;
    const testRunGUID = framework.uuidGenerator.v4();
    const cucumberJSONFilePath = argv.sourceFile;
    const passed = argv.passed.toLowerCase().trim()=='true';

    const cucumberTestResult = framework
        .cucumber
        .newCucumberResultFromFilePathWhenProcessResultUnavailable(
            cucumberJSONFilePath, passed
        );

    framework.clusterTesting.newClusterResultPreparer()
        .prepareAndSaveClusterResult(
            clusterId,
            cucumberTestResult,
            framework.nodeWrapperFactory.path.basename(cucumberJSONFilePath).replace('.json',''),
            testRunGUID
        )
        .then(
            r => framework.console.log('Success!'),
            e => framework.console.error(e.stack)
        );
};