import {IStringHelper} from "./i-string-helper";

export class StringHelper implements IStringHelper {
    trimSpaceFromMultiLineString(stringToTrim:string):string {
        return stringToTrim.split("\n").map(l=>l.trim()).join("\n");
    }
}