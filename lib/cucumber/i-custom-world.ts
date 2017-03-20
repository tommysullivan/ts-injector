import {SharedData} from "../support/shared-data";

export interface ICustomWorld {
    sharedData:SharedData;
    Before:(...args:any[])=>any;
    setDefaultTimeout(timeout:number):void;
}

export type WorldConstructor = (this:ICustomWorld) => void;