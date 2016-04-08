interface IThenable<T> {
    then<R>(onFulfilled?: (value: T) => IThenable<R>|R, onRejected?: (error: any) => IThenable<R>|R): IThenable<R>;
    catch<R>(onRejected?: (error: any) => IThenable<R>|R): IThenable<R>;
    done<R>(onFulfilled?: (value: T) => IThenable<R>|R, onRejected?: (error: any) => IThenable<R>|R): IThenable<R>;
}

export default IThenable;