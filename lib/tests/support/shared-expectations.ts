import {expect} from 'chai';
import * as sinon from 'sinon';
import {IProcessResult} from "../../private-devops-ts-primitives/node-js-wrappers/i-process-result";
import {IProcessOutputProgress} from "../../private-devops-ts-primitives/ssh/i-ssh-session";
import {IProgressCallback} from "../../private-devops-ts-primitives/futures/i-future-with-progress";

export const slowBashCommandWithProgressUpdates = 'sleep 1; echo "1"; sleep 1; (>&2 echo "error"); sleep 1; echo "2"; sleep 1; echo "3"';

export function verifyProgressCallbacksWork(progressCallback:IProgressCallback<IProcessOutputProgress>):void {
    expect(progressCallback).to.have.been.calledWith(sinon.match({stdOut: `1\n`}));
    expect(progressCallback).to.have.been.calledWith(sinon.match({stdOut: `2\n`}));
    expect(progressCallback).to.have.been.calledWith(sinon.match({stdOut: `3\n`}));
    expect(progressCallback).to.have.been.calledWith(sinon.match({stdErr: `error\n`}));
    expect(progressCallback).not.to.have.been.calledWith(sinon.match({stdOut: `error\n`}));
    expect(progressCallback).not.to.have.been.calledWith(sinon.match({stdErr: `1\n`}));
}

export function verifyProcessOutput(processResult:IProcessResult):void {
    const completeStdout = processResult.stdoutLines.join("\n");
    const completeStderr = processResult.stderrLines.join("\n");
    const completeOutput = processResult.allOutputLines.join("\n");

    expect(completeStdout).to.contain(`1\n2\n3\n`);
    expect(completeStdout).not.to.contain(`error\n`);

    expect(completeStderr).to.contain(`error\n`);
    expect(completeStderr).not.to.contain(`1\n`);

    expect(completeOutput).to.contain(`1\n`);
    expect(completeOutput).to.contain(`2\n`);
    expect(completeOutput).to.contain(`3\n`);
    expect(completeOutput).to.contain(`error\n`);
}