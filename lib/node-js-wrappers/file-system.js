"use strict";
var file_stats_1 = require("./file-stats");
var FileSystem = (function () {
    function FileSystem(fsModule, typedJSON, collections, errors, nodeWrapperFactory, promiseFactory) {
        this.fsModule = fsModule;
        this.typedJSON = typedJSON;
        this.collections = collections;
        this.errors = errors;
        this.nodeWrapperFactory = nodeWrapperFactory;
        this.promiseFactory = promiseFactory;
    }
    FileSystem.prototype.readFileSync = function (filePath) {
        return this.fsModule.readFileSync(filePath);
    };
    FileSystem.prototype.readFile = function (filePath) {
        var _this = this;
        return this.promiseFactory.newPromise(function (resolve, reject) {
            _this.fsModule.readFile(filePath, function (error, data) {
                if (error)
                    reject(error);
                else
                    resolve(data);
            });
        });
    };
    FileSystem.prototype.delete = function (filePath) {
        var _this = this;
        return this.promiseFactory.newPromise(function (resolve, reject) {
            return _this.fsModule.unlink(filePath, function (error) {
                if (error)
                    reject(error);
                else
                    resolve(null);
            });
        });
    };
    FileSystem.prototype.readdirSync = function (directoryPath) {
        return this.collections.newList(this.fsModule.readdirSync(directoryPath));
    };
    FileSystem.prototype.statSync = function (filePath) {
        return new file_stats_1.default(this.fsModule.statSync(filePath));
    };
    FileSystem.prototype.writeFileSync = function (filePath, content) {
        this.fsModule.writeFileSync(filePath, content);
        return this;
    };
    FileSystem.prototype.createReadStream = function (path) {
        return this.nodeWrapperFactory.newFileStream(this.fsModule.createReadStream(path));
    };
    FileSystem.prototype.readJSONFileSync = function (filePath) {
        try {
            return JSON.parse(this.fsModule.readFileSync(filePath));
        }
        catch (e) {
            throw this.errors.newErrorWithCause(e, "could not parse or read json at path " + filePath);
        }
    };
    FileSystem.prototype.throwWrongTypeError = function (filePath, expectedTypeName) {
        throw new Error("Expected root JSON object at file \"" + filePath + " to be of type " + expectedTypeName);
    };
    FileSystem.prototype.readTypedJSONFileSync = function (filePath, expectedTypeName) {
        var rawJSON = this.readJSONFileSync(filePath);
        if (typeof (rawJSON) != expectedTypeName)
            this.throwWrongTypeError(filePath, expectedTypeName);
        return rawJSON;
    };
    FileSystem.prototype.readJSONObjectFileSync = function (filePath) {
        return this.typedJSON.newJSONObject(this.readTypedJSONFileSync(filePath, 'object'));
    };
    FileSystem.prototype.readJSONArrayFileSync = function (filePath) {
        var _this = this;
        var rawJSON = this.readJSONFileSync(filePath);
        if (!this.typedJSON.isArray(rawJSON))
            this.throwWrongTypeError(filePath, 'array');
        return this.collections.newList(rawJSON.map(function (j) { return _this.typedJSON.newJSONObject(j); }));
    };
    return FileSystem;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = FileSystem;
//# sourceMappingURL=file-system.js.map