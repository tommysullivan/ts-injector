// import IList from "../../collections/i-list";
// import ITestSuiteConfiguration from "./i-test-suite-configuration";
// import IJSONObject from "../../typed-json/i-json-object";
//
// export default class TestSuiteConfiguration implements ITestSuiteConfiguration {
//     private testSuiteJSON:IJSONObject;
//
//     constructor(testSuiteJSON:IJSONObject) {
//         this.testSuiteJSON = testSuiteJSON;
//     }
//
//     get id():string { return this.testSuiteJSON.stringPropertyNamed('id'); }
//     get featureFilePaths():IList<string> { return this.testSuiteJSON.listNamed<string>('features') }
//    
//     toJSON():any { return this.testSuiteJSON.toRawJSON(); }
//     toString():string { return this.testSuiteJSON.toString(); }
// }