module.exports = function(api, clusterUnderTestConfig, clusterNodes, _) {
    return {
        isManagedByESXI: () => clusterUnderTestConfig.controller.type=='esxi',
        revertToState: (desiredStateName) => {
            return api.newGroupPromise(clusterNodes.map(n=>n.revertToState(desiredStateName)));
        },
        verifyMapRNotInstalled: () => {
            return api.newGroupPromise(clusterNodes.map(n=>n.verifyMapRNotInstalled()));
        },
        nodesHosting: serviceName => {
            return clusterNodes.filter(n=>n.isHostingService(serviceName));
        },
        nodeHosting: function(serviceName) {
            var node = this.nodesHosting(serviceName)[0];
            if(node==null) throw new Error(`Could not find node hosting service named ${serviceName}`);
            return node;
        },
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