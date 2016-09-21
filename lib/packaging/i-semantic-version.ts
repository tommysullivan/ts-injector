export interface ISemanticVersion {
    matches(versionString:string):boolean;
    toString():string;
}