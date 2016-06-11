interface ISemanticVersion {
    matches(versionString:string):boolean;
    toString():string;
}
export default ISemanticVersion;