import "../support/prepare-test-environment";
import {frameworkForNodeJSInstance} from "../../framework/nodejs/framework-for-node-js-instance";
import {expect} from "chai";
import * as sinon from 'sinon';
import {IProgressCallback} from "../../futures/i-future-with-progress";
import {IProcessOutputProgress} from "../../ssh/i-ssh-session";
import { slowBashCommandWithProgressUpdates, verifyProcessOutput, verifyProgressCallbacksWork } from "../support/shared-expectations";

describe('node-js-wrappers', () => {
    describe('process', () => {
        const testCommand = `echo Hi`;
        const process = frameworkForNodeJSInstance.process;

        describe('executeCommand', () => {
            it('command executes and I get the result', async () => {
                const commandResult = await process.executeCommand(testCommand, process.environmentVariables.clone());
                expect(commandResult.stdoutLines.join(``).trim()).to.equal(`Hi`)
            });
            context('when the command takes a while and streams output', async () => {
                it('command executes and I get the result', async () => {
                    const progressCallback = sinon.spy() as IProgressCallback<IProcessOutputProgress>;
                    const processResult = await process.executeCommand(slowBashCommandWithProgressUpdates, frameworkForNodeJSInstance.process.environmentVariables).onProgress(progressCallback);
                    verifyProgressCallbacksWork(progressCallback);
                    verifyProcessOutput(processResult);
                }).timeout(6000);
            });
        });
    });
});