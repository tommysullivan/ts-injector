import {expect} from "chai";
import {Let} from "mocha-let-ts";
import "../support/prepare-test-environment";
import ISuiteCallbackContext = Mocha.ISuiteCallbackContext;
import {NativeClassReference} from "../../private-devops-ts-injector/reflection/interfaces";
import {FunctionSignature} from "../../private-devops-ts-injector/reflection/FunctionSignature";
import {reflectionDigest} from "../support/sharedLets";


type GivenCallback = (this: ISuiteCallbackContext) => void;
const given = (description: string, cb:GivenCallback) => context(`Given: ${description}`, cb);
const describeClass = <T>(theClass:NativeClassReference<T>, cb:GivenCallback) => context(`Unit Tests for Class: ${theClass.name}`, cb);
const describeMethod = <T>(description:string, cb:GivenCallback) => context(`Method: ${description}`, cb);
const andGiven = (description: string, cb:GivenCallback) => context(`And given: ${description}`, cb);
const then = it;

describeClass(FunctionSignature, () => {
    given("f is an instance of FunctionSignature that represents a function of type '():void'", () => {
        andGiven("g is of type ():void", () => {
            const g = Let(  () => reflectionDigest().FunctionThatReteurnsVoid);
            describeMethod("f.isPartialFunction(g:IFunction<void>):boolean", () => {
                const f = Let(() => reflectionDigest().FunctionThatReturnsIDependencyInterface);
                then("g is a partial function of f.", () => {
                    expect(f().isPartialFunction(g())).to.be.true;
                });
            });
        });
    });
});