import {IPhaseConfig} from "./i-phase-config";

export interface IReleaseConfig {
    name:string;
    phases:Array<IPhaseConfig>;
}