"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var cucumber_tsflow_1 = require("cucumber-tsflow");
var JavaSteps = (function () {
    function JavaSteps() {
    }
    JavaSteps.prototype.installJava = function () {
        return $.expectAll($.clusterUnderTest.nodes().map(function (n) { return n.executeShellCommand(n.packageManager.installJavaCommand); })).to.eventually.be.fulfilled;
    };
    __decorate([
        cucumber_tsflow_1.given(/^I have installed Java$/)
    ], JavaSteps.prototype, "installJava", null);
    JavaSteps = __decorate([
        cucumber_tsflow_1.binding()
    ], JavaSteps);
    return JavaSteps;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = JavaSteps;
module.exports = JavaSteps;
//# sourceMappingURL=java-steps.js.map