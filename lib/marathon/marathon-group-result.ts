import {IMarathonGroupResult} from "./i-marathon-group-result";
import {IList} from "../collections/i-list";
import {IJSONObject} from "../typed-json/i-json-object";

export class MarathonGroupResult implements IMarathonGroupResult {
    constructor(
        private resultJson:IJSONObject
    ){}

   get apps():IList<IJSONObject> {
       return this.resultJson.listOfJSONObjectsNamed(`apps`);
   }

   get allApplicationIds():IList<string> {
       return this.apps.map(app => app.stringPropertyNamed(`id`));
   }
}