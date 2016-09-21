export interface IError {
    message:string;
    toJSON():any;
    toString():string;
}