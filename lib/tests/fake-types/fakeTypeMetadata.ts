export const typeMetadataFakedForTestPurposes = {
    "classes": [
        {
            "name": "PersonA",
            "constructorArgs": [
                { "name": "a", "typeName": "number"}
            ]
        },
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