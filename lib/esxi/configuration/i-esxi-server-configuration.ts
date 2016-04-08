interface IESXIServerConfiguration {
    id:string;
    host:string;
    username:string;
    password:string;
    type:string;
    
    toJSON():any;
}

export default IESXIServerConfiguration;