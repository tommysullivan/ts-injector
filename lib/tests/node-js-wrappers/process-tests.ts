import "../support/prepare-test-environment";
import {expect} from "chai";
import * as sinon from 'sinon';
import {IProgressCallback} from "../../private-devops-ts-primitives/futures/i-future-with-progress";
import {IProcessOutputProgress} from "../../private-devops-ts-primitives/ssh/i-ssh-session";
import { slowBashCommandWithProgressUpdates, verifyProcessOutput, verifyProgressCallbacksWork } from "../support/shared-expectations";
import {PrimitivesForNodeJS} from "../../private-devops-ts-primitives/api/nodejs/primitives-for-node-js";
import {Let} from "mocha-let-ts";

describe('node-js-wrappers', () => {
    describe('process', () => {
        const testCommand = `echo Hi`;
        const primitives = Let(()=>new PrimitivesForNodeJS());
        const process = Let(()=>primitives().process);

        describe('executeCommand', () => {
            it('command executes and I get the result', async () => {
                const commandResult = await process().executeCommand(testCommand, process().environmentVariables.clone());
                expect(commandResult.stdoutLines.join(``).trim()).to.equal(`Hi`)
            });
            context('when the command takes a while and streams output', async () => {
                it('command executes and I get the result', async () => {
                    const progressCallback = sinon.spy() as IProgressCallback<IProcessOutputProgress>;
                    const processResult = await process().executeCommand(slowBashCommandWithProgressUpdates, primitives().process.environmentVariables).onProgress(progressCallback);
                    verifyProgressCallbacksWork(progressCallback);
                    verifyProcessOutput(processResult);
                }).timeout(6000);
            });
        });
    });
});