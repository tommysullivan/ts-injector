import {SharedData} from "../support/shared-data";
import {IFuture} from "../futures/i-future";

export interface ICustomWorld {
    sharedData:SharedData;
    Before: (beforeHandler: (this: ICustomWorld) => IFuture<any> | void) => any;
    BeforeFeatures: (beforeHandler: (this: ICustomWorld) => IFuture<any> | void) => any;
    setDefaultTimeout(timeout:number):void;
}

export type WorldConstructor = (this:ICustomWorld) => void;