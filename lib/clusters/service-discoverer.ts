import {ICluster} from "./i-cluster";
import {IVersioning} from "../versioning/i-versioning";
import {INode} from "./i-node";
import {IList} from "../collections/i-list";
import {IErrors} from "../errors/i-errors";
import {IServiceDiscoverer} from "./i-service-discoverer";
import {IFutures} from "../futures/i-futures";
import {IFuture} from "../futures/i-future";

export class ServiceDiscoverer implements IServiceDiscoverer {
    private versioning:IVersioning;
    private futures:IFutures;
    private errors:IErrors;

    constructor(versioning:IVersioning, futures:IFutures, errors:IErrors) {
        this.versioning = versioning;
        this.futures = futures;
        this.errors = errors;
    }

    nodesHostingServiceViaDiscovery(clusterUnderTest:ICluster, serviceName:string):IFuture<IList<INode>> {
        const possibleHostNodes = clusterUnderTest.nodesHosting(serviceName);
        return possibleHostNodes.isEmpty
            ? this.nodesHostingServiceAccordingToInstaller(clusterUnderTest, serviceName)
            : this.futures.newFutureForImmediateValue(possibleHostNodes);
    }

    nodesHostingServiceAccordingToInstaller(clusterUnderTest:ICluster, serviceName:string):IFuture<IList<INode>> {
        throw new Error('need services and versions for release test context');
        // try {
        //     const desiredVersion = this.versioning.serviceSet().firstWhere(s=>s.name==serviceName).version;
        //     return clusterUnderTest.newAuthedInstallerSession()
        //         .then(installerRestSession => installerRestSession.services())
        //         .then((services:IInstallerServices) => {
        //             const serviceAccordingToInstaller = services.serviceMatchingNameAndVersion(
        //                 serviceName, desiredVersion
        //             );
        //             return serviceAccordingToInstaller.hostNames()
        //         })
        //         .then(hostNames=>hostNames.map(
        //             hostName=>clusterUnderTest.nodeWithHostName(hostName)
        //         ));
        // }
        // catch(e) {
        //     throw this.errors.newErrorWithCause(e, `Could not use installer service to discover "${serviceName}" for cluster ${clusterUnderTest.name}`)
        // }
    }

    nodeHostingServiceViaDiscover(clusterUnderTest:ICluster, serviceName:string):IFuture<INode> {
        return this.nodesHostingServiceViaDiscovery(clusterUnderTest, serviceName)
            .then(possibleNodes=>{
                return possibleNodes.first;
                // if(possibleNodes.hasMany)
                //     // throw this.errors.newErrorWithJSONDetails(
                //     //     `Ambiguous request to discover node hosting service "${serviceName}"`,
                //     //     possibleNodes.toJSON()
                //     // );
                // else return possibleNodes.first;
            });
    }
}