import "../support/prepare-test-environment";
import {frameworkForNodeJSInstance} from "../../framework/nodejs/framework-for-node-js-instance";
import {expect} from "chai";

describe('node-js-wrappers', () => {
    describe('process', () => {
        const testCommand = `echo Hi`;
        const process = frameworkForNodeJSInstance.process;

        describe('executeCommand', () => {
            context('when we have a command to execute', () => {
                it('command executes and I get the result', async () => {
                    const commandResult = await process.executeCommand(testCommand, process.environmentVariables.clone());
                    expect(commandResult.stdoutLines.join(``).trim()).to.equal(`Hi`)
                });
            });
        });
    });
});