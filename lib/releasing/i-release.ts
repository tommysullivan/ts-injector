import {IPhase} from "./i-phase";
import {IList} from "../collections/i-list";

export interface IRelease {
    name:string;
    phaseNamed(phaseName:string):IPhase;
    phases:IList<IPhase>;
}