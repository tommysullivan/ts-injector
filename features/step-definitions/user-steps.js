"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var cucumber_tsflow_1 = require("cucumber-tsflow");
var UserSteps = (function () {
    function UserSteps() {
    }
    UserSteps.prototype.createNewLinuxUser = function (username, numericUserId, userGroupName, password) {
        var userCreateComamnd = "id -u " + username + " || useradd -u " + numericUserId + " -g " + userGroupName + " -p $(openssl passwd -1 " + password + ") " + username;
        var groupCreateCommand = "getent group " + userGroupName + " || groupadd -g " + numericUserId + " " + username;
        var resultList = $.clusterUnderTest.nodes().map(function (n) { return n.executeShellCommands($.collections.newList([groupCreateCommand, userCreateComamnd])); });
        return $.expectAll(resultList).to.eventually.be.fulfilled;
    };
    __decorate([
        cucumber_tsflow_1.given(/^I create the user "([^"]*)" with id "([^"]*)" group "([^"]*)" and password "([^"]*)"$/)
    ], UserSteps.prototype, "createNewLinuxUser", null);
    UserSteps = __decorate([
        cucumber_tsflow_1.binding()
    ], UserSteps);
    return UserSteps;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = UserSteps;
module.exports = UserSteps;
//# sourceMappingURL=user-steps.js.map