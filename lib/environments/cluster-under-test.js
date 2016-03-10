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
            //#    When I set the MapR Version to "5.1.0"
            //#    And I set the Edition to "Converged Enterprise Edition"
            //#    And I choose to add License after installation completed
            //#    And I enable the services configured for my Cluster Under Test
            //#    And I enable YARN
            //#    And I provide an administrator password of "mapr"
            //#    And I name my cluster according to the configured name of my cluster
            //#    And I specify the nodes configured for my cluster
            //#    And I specify the "/dev/sdb, /dev/sdc" as my disks
            //#    And I choose "SSH - Password" as a Remote Authentication method
            //#    And I specify "root" as my SSH Username
            //#    And I specify "mapr" as my SSH Password
            //#    Then the REST API indicates that the installation succeeds within "5" minutes
            return api.newPromise((resolve, reject) => {
                var requests = [
                    installerRESTSession.services(),
                    installerRESTSession.configuration()
                ]
                api.newGroupPromise(requests)
                    .then(results => {
                        var installerServices = results[0];
                        var installerConfiguration = results[1];

                        //todo: get the template for the cus
                        //todo: add each of the services whose versions match
                        //todo: get all the services, and for any two with the same name, ensure
                        //they have the same version.

                        //this.serviceNamesAcrossAllNodes().forEach(serviceName => {
                        //    if(installerServices.includeServiceNamed(serviceName)) {
                        //        installerConfiguration.enableComponent(serviceName);
                        //    }
                        //});
                        return installerConfiguration.save();
                    })
                    .done(
                        installerConfiguration=>{
                            console.log('completed', installerConfiguration.toString());
                            resolve();
                        },
                        reject
                    );
            });
        },
        //serviceNamesAcrossAllNodes: () => _.chain(clusterNodes).map(node=>node.serviceNames()).flatten().uniq().value()
    }
}