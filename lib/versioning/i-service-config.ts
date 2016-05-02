interface IServiceConfig {
    name:string;
    version:string;
    toJSON:any;
    isCore:boolean;
    isHealthCheckable:boolean;
}

export default IServiceConfig;