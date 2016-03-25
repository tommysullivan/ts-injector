module.exports = function(api, clusterUnderTestConfig, clusterNodes) {
    function nodeSpecificPromiseFor(node, nodeLevelPromise) {
        return nodeLevelPromise
            .then(result=>{
                return { host: node.host(), output: result };
            })
            .catch(error=>{
                throw new Error(JSON.stringify({ host: node.host(), error: error }));
            });
    }
    function multiNodePromise(promiseProducingFunctionTakesNodeAsParameter) {
        return api.newGroupPromise(clusterNodes.map(n=>{
            return nodeSpecificPromiseFor(n, promiseProducingFunctionTakesNodeAsParameter(n));
        }));
    }
    return {
        id: () => clusterUnderTestConfig['id'],
        isManagedByESXI: () => clusterUnderTestConfig.controller.type=='esxi',
        revertToState: (desiredStateName) => multiNodePromise(n=>n.revertToState(desiredStateName)),
        deleteStateIfExists: (stateName) => multiNodePromise(n=>n.deleteStateIfExists(stateName)),
        verifyMapRNotInstalled: () => multiNodePromise(n=>n.verifyMapRNotInstalled()),
        nodesHosting: serviceName => clusterNodes.filter(n=>n.isHostingService(serviceName)),
        nodeHosting: function(serviceName) {
            var node = this.nodesHosting(serviceName)[0];
            if(node==null) throw new Error(`Could not find node hosting service named ${serviceName}`);
            return node;
        },
        executeShellCommandsOnEachNode: commands => multiNodePromise(n=>n.executeShellCommands(commands)),
        versionGraph: function() {
            return api.newGroupPromise(clusterNodes.map(n=>n.versionGraph()))
                .then(versionGraphs=>api.newClusterVersionGraph(this.id(), versionGraphs));
        },
        captureStateAsSnapshot: snapshotName => multiNodePromise(n=>n.captureStateAsSnapshot(snapshotName)),
        snapshotInfo: () => multiNodePromise(n=>n.snapshotInfo()),
        installViaRESTInstaller: function(installerRESTSession) {
            return api.newPromise((resolve, reject) => {
                var requests = [
                    installerRESTSession.services(),
                    installerRESTSession.configuration()
                ]
                api.newGroupPromise(requests)
                    .then(results => {
                        var installerServices = results[0];
                        var installerConfiguration = results[1];

                        installerServices.all().forEach(serviceConfig => {
                            if(serviceConfig.core) {
                                if(serviceConfig.version==clusterUnderTestConfig.coreVersion)
                                    installerConfiguration.enableService(serviceConfig.name, serviceConfig.version);
                            }
                            else {
                                installerConfiguration.disableService(serviceConfig.name, serviceConfig.version);
                            }
                        });

                        //TODO: Add the transitive dependencies

                        clusterUnderTestConfig.services.forEach(serviceConfig => {
                            if(installerServices.supportsServiceVersion(serviceConfig.name, serviceConfig.version)) {
                                installerConfiguration.enableService(serviceConfig.name, serviceConfig.version);
                            }
                        });

                        installerConfiguration.setSSHUsername(clusterUnderTestConfig.sshUsername);
                        installerConfiguration.setSSHMethod(clusterUnderTestConfig.sshMethod);
                        installerConfiguration.setLicenseType(clusterUnderTestConfig.licenseType);
                        installerConfiguration.setDisks(clusterUnderTestConfig.disks);
                        installerConfiguration.setHosts(clusterNodes.map(c=>c.host()));
                        installerConfiguration.setClusterName(clusterUnderTestConfig.name);
                        installerConfiguration.setClusterAdminPassword(clusterUnderTestConfig.mapRPassword);
                        installerConfiguration.setSSHPassword(clusterUnderTestConfig.sshPassword);

                        return installerConfiguration.save();
                    })
                    .done(
                        installerConfiguration=>{
                            resolve();
                        },
                        reject
                    );
            });
        }
    }
}