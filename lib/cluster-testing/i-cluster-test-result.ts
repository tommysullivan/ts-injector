import {ITestResult} from "../testing/i-test-result";

export interface IClusterTestResult extends ITestResult {
    clusterId:string;
}