import * as sinon from 'sinon';

export type Optional<T> = {
    [P in keyof T]?:T[P];
    }

export function mock<T>(stubs:Optional<T>):T {
    let mock:T = {} as T;
    for(let key in stubs) {
        mock[key] = stubs[key] instanceof Function
            ? sinon.stub().returns(stubs[key]) as any
            : stubs[key];
    }
    return mock as T;
}