import "../support/prepare-test-environment";
import {expect} from "chai";
import {Let} from "mocha-let-ts";
import {
    Class, IArgument, ICustomValueResolver, IInjector, Injector, IReflector, IType,
    Reflector
} from "../../private-devops-ts-primitives/dependency-injection/injector";
import {NotImplementedError} from "../../private-devops-ts-primitives/errors/not-implemented-error";
import {Console, LogLevel} from "../../private-devops-ts-primitives/console/console";
import * as readLineSync from "readline-sync";
import {mock} from "mocha-let-ts/dist/mocha-let-ts/mock";
import * as sinon from "sinon";
import {ConsoleForBrowser} from "../../private-devops-ts-primitives/console/console-for-browser";
import {PrimitivesForBrowser} from "../../private-devops-ts-primitives/api/browser/primitives-for-browser";
import * as $ from 'jquery';

describe('injector @wip', () => {
    class NoArgConstructorClass {}

    class ClassWhoseConstructorDependsOnNoArgConstructorClass {
        constructor(
            public readonly a:NoArgConstructorClass
        ) {}
    }

    class MultiLevelClass {
        constructor(
            public readonly a:NoArgConstructorClass,
            public readonly b:ClassWhoseConstructorDependsOnNoArgConstructorClass,
            public readonly c:ClassWhoseConstructorDependsOnNoArgConstructorClass
        ) {}
    }

    const fakeTypeMetadata = {
        "classes": [
            {
                "name": "NoArgConstructorClass",
                "constructorArgs": []
            },
            {
                "name": "ClassWhoseConstructorDependsOnNoArgConstructorClass",
                "constructorArgs": [
                    { "name": "a", "typeName": "NoArgConstructorClass"}
                ]
            },
            {
                "name": "MultiLevelClass",
                "constructorArgs": [
                    { "name": "a", "typeName": "NoArgConstructorClass"},
                    { "name": "b", "typeName": "ClassWhoseConstructorDependsOnNoArgConstructorClass"},
                    { "name": "c", "typeName": "ClassWhoseConstructorDependsOnNoArgConstructorClass"}
                ]
            },
            {
                "name": "Console",
                "constructorArgs": [
                    { "name": "nativeConsole", "typeName": "any"},
                    { "name": "readLineSyncModule", "typeName": "any"},
                    { "name": "logLevel", "typeName": "LogLevel"}
                ]
            },
            {
                "name": "ConsoleForBrowser",
                "constructorArgs": [
                    { "name": "nativeBrowserConsole", "typeName": "any"}
                ]
            },
            {
                "name": "PrimitivesForBrowser",
                "constructorArgs": [
                    { "name": "nativeConsole", "typeName": "any"},
                    { "name": "nativePromise", "typeName": "any"},
                    { "name": "injector", "typeName": "IInjector"}
                ]
            }
        ]
    };

    const nativeClassReferences = [
        NoArgConstructorClass,
        ClassWhoseConstructorDependsOnNoArgConstructorClass,
        MultiLevelClass,
        Console,
        ConsoleForBrowser,
        PrimitivesForBrowser,
    ];

    const mockNativeConsole = Let(() => mock<any>({log() {}}));

    class CustomValueResolver implements ICustomValueResolver {
        constructor(private readonly reflector:IReflector) {}

        // TODO: Elegant custom factory methods with dependency injected params
        // createConsole(nativeConsole:any, readLineSyncModule:any):Console {
        //     return new Console(nativeConsole, readLineSyncModule, 'INFO');
        // }

        instanceForType(type: IType, injector:IInjector):any {
            if(type.name=='Console') {
                const constructorArgDescriptions = this.reflector.classOf(Console).getConstructor().args;
                return new Console(
                    injector.argumentValue(constructorArgDescriptions[0]),
                    injector.argumentValue(constructorArgDescriptions[1]),
                    'INFO'
                );
            }
            if(type.name=='IInjector') return injector;
        }

        resolveArgumentValue(arg: IArgument): any {
            if(arg.name=='nativeConsole') return mockNativeConsole();
            else if(arg.name=='readLineSyncModule') return readLineSync;
            else if(arg.name=='nativeBrowserConsole') return console;
            else if(arg.name=='nativePromise') return Promise;
            else if(arg.name=='nativeJQuery') return $;
        }

        instanceForTypeWhenAutomaticConstructionFails(type: IType): any {}
    }

    const customValueResolver = Let(() => new CustomValueResolver(reflector()));
    const reflector = Let(() => new Reflector(fakeTypeMetadata, nativeClassReferences));
    const injector = Let(() => new Injector(reflector(), customValueResolver()));
    const theClass = Let<any>(() => { throw new NotImplementedError() });

    it('is instantiable', () => expect(injector()).to.be.an.instanceof(Injector));

    describe('createInstanceOf<ClassToInstantiate>(theClass: NativeClassReference<ClassToInstantiate>)', () => {

        const instanceCreationResult = Let(() => injector().createInstanceOf(theClass()));

        const expectNewInstance = () => {
            it('returns a new instance', () => {
                expect(instanceCreationResult()).to.be.an.instanceof(theClass());
            });
        };

        nativeClassReferences.forEach(nativeClassReference => {
            const classUnderTest = new Class(nativeClassReference, fakeTypeMetadata, new Reflector(fakeTypeMetadata, nativeClassReferences));
            context(classUnderTest.name, () => {
                theClass(() => nativeClassReference);
                expectNewInstance();
            });
        });

        context('MultiLevelClass', () => {
            theClass(() => MultiLevelClass);
            expectNewInstance();

            it('has properties a, b, and c each with their respective, distinct instances of correct type', () => {
                const instance = instanceCreationResult() as MultiLevelClass;
                expect(instance).to.have.property('a').that.is.instanceOf(NoArgConstructorClass);
                expect(instance).to.have.property('b').that.is.instanceOf(ClassWhoseConstructorDependsOnNoArgConstructorClass);
                expect(instance).to.have.property('c').that.is.instanceOf(ClassWhoseConstructorDependsOnNoArgConstructorClass);
                expect(instance.b).to.have.property('a').that.is.instanceOf(NoArgConstructorClass);
                expect(instance.c).to.have.property('a').that.is.instanceOf(NoArgConstructorClass);
                expect(instance.b).to.not.equal(instance.c);
                expect(instance.c.a).to.not.equal(instance.b.a);
            });
        });

        context('Console Usage', () => {
            it('works', () => {
                injector().createInstanceOf(Console).info('some info');
                injector().createInstanceOf(Console).warn('some warning');
                injector().createInstanceOf(Console).error('some error');
                expect(mockNativeConsole().log).to.have.been.calledWith(sinon.match.string, 'some error');
                expect(mockNativeConsole().log).to.have.been.calledWith(sinon.match.string, 'some warning');
                expect(mockNativeConsole().log).to.have.been.calledWith(sinon.match.string, 'some info');
            });
        });

        context('Primitives Usage', () => {
            it('works', () => {
                expect(injector().createInstanceOf(PrimitivesForBrowser).console).to.be.an.instanceOf(ConsoleForBrowser);
            });
        });
    });
});