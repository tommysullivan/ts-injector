import "../support/prepare-test-environment";
import {expect} from "chai";
import {Let} from "mocha-let-ts";
import {Console} from "../../private-devops-ts-primitives/console/console";
import * as sinon from "sinon";

describe('console @wip', () => {
    const subject = Let(() => new Console(null,null,null));
    context('when ...', () => {
        it('meets test expectation', () => {
            expect(subject()).to.exist;
        });
    });
});