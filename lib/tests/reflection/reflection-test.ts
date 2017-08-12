import "../support/prepare-test-environment";
import {Reflector} from "../../private-devops-ts-injector/reflection/reflector";
import {expect} from "chai";
import {typeMetadataFakedForTestPurposes} from "../fake-types/fakeTypeMetadata";
import {MultiLevelClass, nativeClassReferences} from "../fake-types/fakeTypes";

describe('reflection', () => {
    context('when i reflect on the MultiLevelClass class', () => {
        it('has name "MultiLevelClass"', () => {
            const reflector = new Reflector(typeMetadataFakedForTestPurposes, nativeClassReferences);
            expect(reflector.classOf(MultiLevelClass).name).to.equal("MultiLevelClass");
            expect(reflector.classOf(MultiLevelClass).getConstructor().args.length).to.equal(3);

        });
    });

});