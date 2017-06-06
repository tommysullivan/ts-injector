import {IUUIDGenerator} from "../../uuid/i-uuid-generator";
import {Collections} from "../../collections/collections";
import {ICollections} from "../../collections/i-collections";
import {Errors} from "../../errors/errors";
import {IErrors} from "../../errors/i-errors";
import {TypedJSON} from "../../typed-json/typed-json";
import {ITypedJSON} from "../../typed-json/i-typed-json";
import {IFutures} from "../../futures/i-futures";
import {ProcessResult} from "../../process/process-result";
import {IProcessResult} from "../../process/i-process-result";
import {BaseProcessResult} from "../../process/base-process-result";

export abstract class Primitives {
    abstract get futures():IFutures;

    get typedJSON():ITypedJSON { return new TypedJSON(3, this.collections, 200); }
    get errors():IErrors { return new Errors(); }
    get uuidGenerator():IUUIDGenerator { return require('node-uuid'); }

    get collections():ICollections {
        return new Collections(listOfFutures=>this.futures.newFutureList(listOfFutures));
    }
}