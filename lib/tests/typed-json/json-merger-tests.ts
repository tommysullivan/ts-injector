import "../support/prepare-test-environment";
import {Let} from "mocha-let-ts";
import {JSONMerger} from "../../private-devops-ts-primitives/typed-json/json-merger";
import {expect} from "chai";
import {PrimitivesForNodeJS} from "../../private-devops-ts-primitives/api/nodejs/primitives-for-node-js";

describe('typed-json', () => {
    describe('JSONMerger', () => {
        const primitives = Let(()=>new PrimitivesForNodeJS());
        const subject = Let(() => primitives().typedJSON.newJSONMerger());
        const json1 = Let<any>();
        const json2 = Let<any>();
        const mergedResult = Let(() => subject().mergeJSON(json1(), json2()));

        describe('mergeJSON', () => {
            context('when we have two named arrays of numbers', () => {
                json1(() => ({namedArray: [0]}));
                json2(() => ({namedArray: [1, 2, 3]}));
                it('yields a single named array with all of the elements', () => {
                    expect(mergedResult()).to.deep.equal({namedArray: [0, 1, 2, 3]});
                });
            });

            context('when we merge two arrays and each has a json with the same id', () => {
                json1(() => ({namedArray: [{id: 'id1'}]}));
                json2(() => ({namedArray: [{id: 'id1'}, {id: 'id2'}]}));
                it('throws an error', () => {
                    expect(mergedResult).to.throw;
                });
            });
        });
    });
});