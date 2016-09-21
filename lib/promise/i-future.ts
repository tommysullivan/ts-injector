export interface IFuture<T> {
    then<R>(onFulfilled?: (value: T) => IFuture<R>|R, onRejected?: (error: any) => IFuture<R>|R): IFuture<R>;
    catch<R>(onRejected?: (error: any) => IFuture<R>|R): IFuture<R>;
    done<R>(onFulfilled?: (value: T) => IFuture<R>|R, onRejected?: (error: any) => IFuture<R>|R): IFuture<R>;
}