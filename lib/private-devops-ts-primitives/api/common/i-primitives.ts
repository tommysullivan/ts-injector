import {IRest} from "../../rest/common/i-rest";
import {IConsole} from "../../console/i-console";
import {INodeWrapperFactory} from "../../node-js-wrappers/i-node-wrapper-factory";
import {ISSHAPI} from "../../ssh/i-ssh-api";
import {ITypedJSON} from "../../typed-json/i-typed-json";
import {IErrors} from "../../errors/i-errors";
import {ICollections} from "../../collections/i-collections";
import {IUUIDGenerator} from "../../uuid/i-uuid-generator";
import {IFileSystem} from "../../node-js-wrappers/i-filesystem";
import {IProcess} from "../../node-js-wrappers/i-process";
import {IFutures} from "../../futures/i-futures";

export interface IPrimitives {
    uuidGenerator:IUUIDGenerator;
    collections:ICollections;
    errors:IErrors;
    futures:IFutures;
    typedJSON:ITypedJSON;
    console:IConsole;
    rest:IRest;
    nodeWrapperFactory:INodeWrapperFactory;
    process:IProcess;
    fileSystem:IFileSystem;
    sshAPI:ISSHAPI;
}