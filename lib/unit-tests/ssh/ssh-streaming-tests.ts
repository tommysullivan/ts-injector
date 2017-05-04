import '../support/prepare-test-environment';
import {expect} from 'chai';
import * as sinon from 'sinon';
import {Let} from "mocha-let-ts";
import {frameworkForNodeJSInstance} from "../../framework/nodejs/framework-for-node-js-instance";
import {IProcessOutputProgress} from "../../ssh/i-ssh-session";
import {IProgressCallback} from "../../futures/i-future-with-progress";

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
            const result = await sshSession.executeCommand('sleep 1; echo "1"; sleep 1; (>&2 echo "error"); sleep 1; echo "2"; sleep 1; echo "3"').onProgress(progressCallback);
            const completeStdout = result.processResult.stdoutLines.join("\n");
            const completeStderr = result.processResult.stderrLines.join("\n");
            const completeOutput = result.processResult.allOutputLines.join("\n");
            expect(progressCallback).to.have.been.calledWith(sinon.match({stdOut: "1\n"}));
            expect(progressCallback).to.have.been.calledWith(sinon.match({stdOut: "2\n"}));
            expect(progressCallback).to.have.been.calledWith(sinon.match({stdOut: "3\n"}));
            expect(progressCallback).to.have.been.calledWith(sinon.match({stdErr: "error\n"}));
            expect(progressCallback).not.to.have.been.calledWith(sinon.match({stdOut: "error\n"}));
            expect(progressCallback).not.to.have.been.calledWith(sinon.match({stdErr: "1\n"}));

            expect(completeStdout).to.contain('1\n2\n3\n');
            expect(completeStdout).not.to.contain('error\n');

            expect(completeStderr).to.contain('error\n');
            expect(completeStderr).not.to.contain('1\n');

            expect(completeOutput).to.contain('1\n');
            expect(completeOutput).to.contain('2\n');
            expect(completeOutput).to.contain('3\n');
            expect(completeOutput).to.contain('error\n');
        }).timeout(6000);
    });
});