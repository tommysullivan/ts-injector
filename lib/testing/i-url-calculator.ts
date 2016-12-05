import {IList} from "../collections/i-list";

export interface IURLCalculator {
    calculateURL(testRunUUID:string):string;
    writeUrlsToPropertiesFile(urls:IList<string>):void;
    writeUrlToPropertiesFile(url:string):void;
}