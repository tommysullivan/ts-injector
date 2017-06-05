import '../support/prepare-test-environment';
import {expect} from 'chai';
import * as sinon from 'sinon';
import {Let} from "mocha-let-ts";
import {IProcessOutputProgress} from "../../private-devops-ts-primitives/ssh/i-ssh-session";
import {IProgressCallback} from "../../private-devops-ts-primitives/futures/i-future-with-progress";
import { slowBashCommandWithProgressUpdates, verifyProcessOutput, verifyProgressCallbacksWork } from "../support/shared-expectations";
import {PrimitivesForNodeJS} from "../../private-devops-ts-primitives/api/nodejs/primitives-for-node-js";

describe('SSHClient', () => {
    const primitives = Let(()=>new PrimitivesForNodeJS());
    const subject = Let(()=>primitives().sshAPI.newSSHClient());
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
        }).timeout(10000);
    });
});