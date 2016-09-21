export interface IJSONSerializable {
    //NOTE: if toJSON is not defined on an instance of IJSONSerializable,
    //dependents assume via JSON.stringify(instance:IJSONSerializable) will succeed
    toJSON?():any;
}