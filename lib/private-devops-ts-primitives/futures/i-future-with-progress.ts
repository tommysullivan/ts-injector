import {IFuture} from "./i-future";

export type IProgressCallback<ProgressType> = (progressInfo:ProgressType)=>any;

export interface IFutureWithProgress<ProgressType, ResultType> extends IFuture<ResultType> {
    onProgress(progressCallback:IProgressCallback<ProgressType>):IFutureWithProgress<ProgressType, ResultType>;
}