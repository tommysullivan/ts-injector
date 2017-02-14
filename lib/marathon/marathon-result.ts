import {IMarathonResult} from "./i-marathon-result";
import {ICollections} from "../collections/i-collections";
import {ITypedJSON} from "../typed-json/i-typed-json";
import {IList} from "../collections/i-list";
import {IJSONObject} from "../typed-json/i-json-object";
import {IMarathonGroupResult} from "./i-marathon-group-result";
import {MarathonGroupResult} from "./marathon-group-result";

export class MarathonResult implements IMarathonResult {
    constructor(
        private typedJSON:ITypedJSON,
        private resultJson:any,
        private collections:ICollections
    ){}

    private get typedJSONResult():IJSONObject {
        return this.typedJSON.newJSONObject(this.resultJson);
    }

    get apps(): IList<IJSONObject> {
        return this.typedJSONResult.hasPropertyNamed(`app`) ?
            this.collections.newList<IJSONObject>([this.typedJSONResult.jsonObjectNamed(`app`)])
            : this.typedJSONResult.listOfJSONObjectsNamedOrDefaultToEmpty(`apps`);
    }

    get hasMessage():boolean {
        return this.typedJSONResult.hasPropertyNamed(`message`);
    }

    get message():string {
        return this.typedJSONResult.stringPropertyNamed(`message`);
    }

    get tasks():IList<IJSONObject> {
        const app = this.apps.first;
        return app.listOfJSONObjectsNamed(`tasks`);
    }

    get taskState():string {
        return this.tasks.length > 0
            ? this.tasks.first.stringPropertyNamed(`state`)
            : `WAITING`;

    }

    get ipAddressOfLaunchedImage(): string {
        return this.tasks.first.listOfJSONObjectsNamed(`ipAddresses`).first.stringPropertyNamed(`ipAddress`);
    }

    get id():string {
        if(!this.typedJSONResult.hasPropertyNamed(`id`))
            throw new Error(`Id not found in the result`);
        return this.typedJSONResult.stringPropertyNamed(`id`);
    }

    get groups():IList<IMarathonGroupResult> {
        return this.typedJSONResult.listOfJSONObjectsNamed(`groups`).map(group => new MarathonGroupResult(group));
    }

    get labels():IJSONObject {
        return this.apps.first.jsonObjectNamed(`labels`);
    }
}