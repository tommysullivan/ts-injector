import IStepDefinitions from "./i-step-definitions";
import IThenable from "../promise/i-thenable";

export default class StepDefinitions<ScenarioStateType> implements IStepDefinitions<ScenarioStateType> {
    private thisObjectWithinStepDefinitionFileExportFunction:any;

    constructor(thisObjectWithinStepDefinitionFileExportFunction:any) {
        this.thisObjectWithinStepDefinitionFileExportFunction = thisObjectWithinStepDefinitionFileExportFunction;
    }

    private performDefinition(regex:RegExp|string, functionDefiningStep:Function):IStepDefinitions<ScenarioStateType> {
        var callbackAdapters = [
            function() { return functionDefiningStep(this); },
            function(a) { return functionDefiningStep(this, a); },
            function(a, b) { return functionDefiningStep(this, a, b); },
            function(a, b, c) { return functionDefiningStep(this, a, b, c); },
            function(a, b, c, d) { return functionDefiningStep(this, a, b, c, d); },
            function(a, b, c, d, e) { return functionDefiningStep(this, a, b, c, d, e); },
            function(a, b, c, d, e, f) { return functionDefiningStep(this, a, b, c, d, e, f); },
        ];
        this.thisObjectWithinStepDefinitionFileExportFunction.Given(
            regex,
            callbackAdapters[functionDefiningStep.length - 1]
        );
        return this;
    }

    define(regex:RegExp|string, functionDefiningStep:(scenarioState:ScenarioStateType, ...args:Array<string>)=>void):IStepDefinitions<ScenarioStateType> {
        return this.performDefinition(regex, functionDefiningStep);
    }

    defineAsync<R>(regex:RegExp|string, functionDefiningStep:(scenarioState:ScenarioStateType, ...args:Array<string>)=>IThenable<R>):IStepDefinitions<ScenarioStateType> {
        return this.performDefinition(regex, functionDefiningStep);
    }
}