import "../support/prepare-test-environment";
import {expect} from "chai";
import {Let} from "mocha-let-ts";
import * as sinon from "sinon";
import {Errors} from "../../private-devops-ts-primitives/errors/errors";

describe('errors @wip', () => {
    const subject = Let(() => new Errors());
    context('when ...', () => {
        it('meets test expectation', () => {
            expect(subject()).to.exist;
        });
    });
});