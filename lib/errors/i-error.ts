interface IError {
    message:string;
    toJSON():any;
    toString():string;
}

export default IError;