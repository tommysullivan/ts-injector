import {frameworkForNodeJSInstance} from "../framework/nodejs/framework-for-node-js-instance";

const framework = frameworkForNodeJSInstance;
const collections = framework.collections;
const sshApi = framework.sshAPI;

const dirCreateCommand = `mkdir -p /mapr`;
const mountDirCommand = `mount -t nfs ${framework.frameworkConfig.dockerInfrastructureConfig.mesosClusters[0].maprNfsServerIP}:/mapr /mapr`;

collections.newList(framework.frameworkConfig.dockerInfrastructureConfig.mesosClusters[0].mesosSlaves)
    .map(ipaddress => sshApi.newSSHClient().connect(ipaddress,`root`,`mapr`)
        .then(client => client.executeCommands(dirCreateCommand, mountDirCommand)));