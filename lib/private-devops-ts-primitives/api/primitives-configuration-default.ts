import {IPrimitivesConfiguration} from "./nodejs/i-primitives-configuration";

export const PrimitivesConfigurationDefault:IPrimitivesConfiguration = {
    ssh: {
        temporaryStorageLocation: 'tmp',
        writeCommandsToStdout: false
    },
    logLevel: "INFO",
    rest: {
        debugHTTP: false
    }
}