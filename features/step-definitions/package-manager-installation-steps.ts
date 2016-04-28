import Framework from "../../lib/framework/framework";
declare var $:Framework;
declare var module:any;

module.exports = function() {
    this.Given(/^I have set the repository locations on each node in the cluster$/, function (callback) {
        $.clusterUnderTest.nodes().map(n=>n.newSSHSession())
            .then(sshSessions=>{

            });
    });
}
