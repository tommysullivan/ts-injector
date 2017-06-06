import {IRest} from "../../rest/common/i-rest";
import {IConsole} from "../../console/i-console";
import {ISSHAPI} from "../../ssh/i-ssh-api";
import {ITypedJSON} from "../../typed-json/i-typed-json";
import {IErrors} from "../../errors/i-errors";
import {ICollections} from "../../collections/i-collections";
import {IUUIDGenerator} from "../../uuid/i-uuid-generator";
import {IFutures} from "../../futures/i-futures";
import {IProcess} from "../../process/i-process";
import {IFileSystem} from "../../filesystem/i-filesystem";

export interface IPrimitives {
    uuidGenerator:IUUIDGenerator;
    collections:ICollections;
    errors:IErrors;
    futures:IFutures;
    typedJSON:ITypedJSON;
    console:IConsole;
    rest:IRest;
    process:IProcess;
    fileSystem:IFileSystem;
    sshAPI:ISSHAPI;
}