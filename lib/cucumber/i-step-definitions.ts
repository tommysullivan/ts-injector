import IThenable from "../promise/i-thenable";

interface IStepDefinitions<ScenarioStateType> {
    define(regex:RegExp, functionDefiningStep:(scenarioState:ScenarioStateType, ...args:string[])=>void):IStepDefinitions<ScenarioStateType>;
    defineAsync<R>(regex:RegExp, functionDefiningStep:(scenarioState:ScenarioStateType, ...args:string[])=>IThenable<R>):IStepDefinitions<ScenarioStateType>;
}

export default IStepDefinitions;