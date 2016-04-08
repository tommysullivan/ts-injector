import IList from "../collections/i-list";

interface ICucumberFeatureResult {
    uniqueTagNames():IList<string>;
    toJSON():any;
}

export default ICucumberFeatureResult;