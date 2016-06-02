import IStringHelper from "./i-string-helper";

export default class StringHelper implements IStringHelper {
    trimSpaceFromMultiLineString(stringToTrim:string):string {
        return stringToTrim.split("\n").map(l=>l.trim()).join("\n");
    }
}