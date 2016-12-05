export interface IURLCalculator {
    calculateURL(testRunUUID:string):string;
    writeUrlsToPropertiesFile(url:string):void;
}