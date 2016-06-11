import IRelease from "./i-release";
import IJSONObject from "../typed-json/i-json-object";
import IPhase from "./i-phase";
import IReleasing from "./i-releasing";
import IList from "../collections/i-list";
import IPackageSets from "../packaging/i-package-sets";

export default class Release implements IRelease {
    private configJSON:IJSONObject;
    private releasing:IReleasing;
    private packageSets:IPackageSets;

    constructor(configJSON:IJSONObject, releasing:IReleasing, packageSets:IPackageSets) {
        this.configJSON = configJSON;
        this.releasing = releasing;
        this.packageSets = packageSets;
    }

    get name():string { return this.configJSON.stringPropertyNamed('name'); }
    get phases():IList<IPhase> {
        return this.configJSON.listOfJSONObjectsNamed('phases').map(
            phaseJSON => this.releasing.newPhase(phaseJSON, this.packageSets)
        );
    }
    
    phaseNamed(name:string):IPhase {
        return this.phases.firstWhere(r=>r.name==name);
    }

}