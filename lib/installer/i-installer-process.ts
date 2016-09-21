import {IFuture} from "../promise/i-future";

export interface IInstallerProcess {
    validate():IFuture<any>;
    provision():IFuture<any>;
    install():IFuture<any>;
    log():IFuture<string>;
}