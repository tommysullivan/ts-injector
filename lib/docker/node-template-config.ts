import {IJSONObject} from "../typed-json/i-json-object";
import {INodeTemplateConfig} from "./i-node-template-config";
import {IOperatingSystemConfig} from "../operating-systems/i-operating-system-config";
import {OperatingSystemConfig} from "../operating-systems/operating-system-config";

export class NodeTemplateConfig implements INodeTemplateConfig {
    constructor (
        private imageJSON:IJSONObject
    ){}

    get dockerImageName(): string {
        return this.imageJSON.stringPropertyNamed(`dockerImageName`);
    }

    get instances(): number {
        return this.imageJSON.numericPropertyNamed(`instances`);
    }

    get type(): string {
        return this.imageJSON.hasPropertyNamed(`type`) ?
            this.imageJSON.stringPropertyNamed(`type`)
            : null;
    }

    get diskProvider(): boolean {
        return this.imageJSON.hasPropertyNamed(`diskProvider`) ?
            this.imageJSON.booleanPropertyNamed(`diskProvider`) : null;
    }

    get serviceNames():Array<string> {
      return this.imageJSON.listNamedOrDefaultToEmpty<string>(`serviceNames`).toArray();
    }

    get constraints(): Array<string> {
        return this.imageJSON.listNamedOrDefaultToEmpty<string>(`constraints`).toArray();
    }

    get operatingSystem(): IOperatingSystemConfig {
        return this.imageJSON.hasPropertyNamed(`operatingSystem`)
            ? new OperatingSystemConfig(this.imageJSON.jsonObjectNamed(`operatingSystem`))
            : null;
    }

    toJSON():any {
        return this.imageJSON.toJSON();
    }
}