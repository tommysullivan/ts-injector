"use strict";
var StepDefinitions = (function () {
    function StepDefinitions(thisObjectWithinStepDefinitionFileExportFunction) {
        this.thisObjectWithinStepDefinitionFileExportFunction = thisObjectWithinStepDefinitionFileExportFunction;
    }
    StepDefinitions.prototype.performDefinition = function (regex, functionDefiningStep) {
        var callbackAdapters = [
            function () { return functionDefiningStep(this); },
            function (a) { return functionDefiningStep(this, a); },
            function (a, b) { return functionDefiningStep(this, a, b); },
            function (a, b, c) { return functionDefiningStep(this, a, b, c); },
            function (a, b, c, d) { return functionDefiningStep(this, a, b, c, d); },
            function (a, b, c, d, e) { return functionDefiningStep(this, a, b, c, d, e); },
            function (a, b, c, d, e, f) { return functionDefiningStep(this, a, b, c, d, e, f); },
        ];
        this.thisObjectWithinStepDefinitionFileExportFunction.Given(regex, callbackAdapters[functionDefiningStep.length - 1]);
        return this;
    };
    StepDefinitions.prototype.define = function (regex, functionDefiningStep) {
        return this.performDefinition(regex, functionDefiningStep);
    };
    StepDefinitions.prototype.defineAsync = function (regex, functionDefiningStep) {
        return this.performDefinition(regex, functionDefiningStep);
    };
    return StepDefinitions;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = StepDefinitions;
//# sourceMappingURL=step-definitions.js.map