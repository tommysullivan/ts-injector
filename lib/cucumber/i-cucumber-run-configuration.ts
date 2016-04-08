import IDictionary from "../collections/i-dictionary";

interface ICucumberRunConfiguration {
    environmentVariables():IDictionary<string>;
    jsonResultFilePath():string;
    cucumberAdditionalArgs():string;
    isDryRun():boolean;
    toJSON():any;
}

export default ICucumberRunConfiguration;