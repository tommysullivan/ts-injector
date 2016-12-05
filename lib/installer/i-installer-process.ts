import {IFuture} from "../futures/i-future";

export interface IInstallerProcess {
    validate():IFuture<any>;
    provision():IFuture<any>;
    install():IFuture<any>;
    log():IFuture<string>;
}