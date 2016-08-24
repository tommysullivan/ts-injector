import IClusterUnderTest from "./i-cluster-under-test";
import IVersioning from "../versioning/i-versioning";
import IThenable from "../promise/i-thenable";
import INodeUnderTest from "./i-node-under-test";
import IList from "../collections/i-list";
import IPromiseFactory from "../promise/i-promise-factory";
import IInstallerServices from "../installer/i-installer-services";
import IErrors from "../errors/i-errors";

export default class ServiceDiscoverer {
    private versioning:IVersioning;
    private promiseFactory:IPromiseFactory;
    private errors:IErrors;

    constructor(versioning:IVersioning, promiseFactory:IPromiseFactory, errors:IErrors) {
        this.versioning = versioning;
        this.promiseFactory = promiseFactory;
        this.errors = errors;
    }

    nodesHostingServiceViaDiscovery(clusterUnderTest:IClusterUnderTest, serviceName:string):IThenable<IList<INodeUnderTest>> {
        const possibleHostNodes = clusterUnderTest.nodesHosting(serviceName);
        return possibleHostNodes.isEmpty
            ? this.nodesHostingServiceAccordingToInstaller(clusterUnderTest, serviceName)
            : this.promiseFactory.newPromiseForImmediateValue(possibleHostNodes);
    }

    nodesHostingServiceAccordingToInstaller(clusterUnderTest:IClusterUnderTest, serviceName:string):IThenable<IList<INodeUnderTest>> {
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

    nodeHostingServiceViaDiscover(clusterUnderTest:IClusterUnderTest, serviceName:string):IThenable<INodeUnderTest> {
        return this.nodesHostingServiceViaDiscovery(clusterUnderTest, serviceName)
            .then(possibleNodes=>{
                return possibleNodes.first();
                // if(possibleNodes.hasMany)
                //     // throw this.errors.newErrorWithJSONDetails(
                //     //     `Ambiguous request to discover node hosting service "${serviceName}"`,
                //     //     possibleNodes.toJSON()
                //     // );
                // else return possibleNodes.first();
            });
    }
}