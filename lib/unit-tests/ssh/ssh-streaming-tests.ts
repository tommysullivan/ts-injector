import '../support/prepare-test-environment';
import {expect} from 'chai';
import * as sinon from 'sinon';
import {Let} from "mocha-let-ts";
import {frameworkForNodeJSInstance} from "../../framework/nodejs/framework-for-node-js-instance";
import {IProcessOutputProgress} from "../../ssh/i-ssh-session";
import {IProgressCallback} from "../../futures/i-future-with-progress";
import { slowBashCommandWithProgressUpdates, verifyProcessOutput, verifyProgressCallbacksWork } from "../support/shared-expectations";

describe('SSHClient', () => {
    const subject = Let(()=>frameworkForNodeJSInstance.sshAPI.newSSHClient());
    const host = Let(()=>'devops.lab');
    const username = Let(()=>'root');
    const password = Let(()=>'mapr');

    it('exists', () => expect(subject()).to.exist);

    const futureSSHSession = Let(() => subject().connect(host(), username(), password()));
    describe('sshSession.executeCommand', () => {
        it('yields progress events', async () => {
            const progressCallback = sinon.spy() as IProgressCallback<IProcessOutputProgress>;
            const sshSession = await futureSSHSession();
            const sshResult = await sshSession.executeCommand(slowBashCommandWithProgressUpdates).onProgress(progressCallback);
            verifyProgressCallbacksWork(progressCallback);
            verifyProcessOutput(sshResult.processResult);
        }).timeout(6000);
    });
});