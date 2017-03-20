module.exports = function() {

    this.Given(/^I force a test failure$/, () => {
        throw new Error('Forced Test Failure');
    });

};