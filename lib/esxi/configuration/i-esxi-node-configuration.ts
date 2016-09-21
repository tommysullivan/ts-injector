import {ISnapshotConfiguration} from "./i-snapshot-configuration";

export interface IESXINodeConfiguration {
    name:string;
    id:number;
    states:Array<ISnapshotConfiguration>;
}