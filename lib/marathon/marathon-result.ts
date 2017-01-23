import {IMarathonResult} from "./i-marathon-result";
import {ICollections} from "../collections/i-collections";
import {ITypedJSON} from "../typed-json/i-typed-json";
import {IList} from "../collections/i-list";
import {IJSONObject} from "../typed-json/i-json-object";

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
        const apps = this.apps.first;
        return apps.listOfJSONObjectsNamed(`tasks`);
    }

    get ipAddressOfLaunchedImage(): string {
        return this.tasks.first.listOfJSONObjectsNamed(`ipAddresses`).first.stringPropertyNamed(`ipAddress`);
    }

    get id():string {
        if(!this.typedJSONResult.hasPropertyNamed(`id`))
            throw new Error(`Id not found in the result`);
        return this.typedJSONResult.stringPropertyNamed(`id`);
    }
}