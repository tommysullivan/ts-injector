module.exports = function() {

    this.Given(/^I have installed Spyglass$/, function (callback) {
        this.api.newSpyglassInstaller().install().done(function(installedSpyglassSystem) {
            this.installedSpyglassSystem = installedSpyglassSystem;
            callback();
        }, callback);
    });

    this.Given(/^I restrict that node to run in one of the following ways:$/, function (table) {
        this.hardwareTypes = this.getArrayFromTable(table);
    });

}