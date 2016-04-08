import ISnapshotConfiguration from "./i-snapshot-configuration";
import IList from "../../collections/i-list";

interface IESXINodeConfiguration {
    name:string;
    id:number;
    states:IList<ISnapshotConfiguration>;
}

export default IESXINodeConfiguration;