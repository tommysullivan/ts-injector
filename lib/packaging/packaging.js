"use strict";
var yum_package_manager_1 = require("./yum-package-manager");
var zypper_package_manager_1 = require("./zypper-package-manager");
var apt_package_manager_1 = require("./apt-package-manager");
var yum_config_file_content_1 = require("./yum-config-file-content");
var repository_1 = require("./repository");
var package_1 = require("./package");
var promotion_level_1 = require("./promotion-level");
var semantic_version_1 = require("./semantic-version");
var package_set_1 = require("./package-set");
var repositories_1 = require("./repositories");
var package_sets_1 = require("./package-sets");
var package_from_literals_1 = require("./package-from-literals");
var package_set_reference_1 = require("./package-set-reference");
var package_with_overrides_1 = require("./package-with-overrides");
var package_comparer_1 = require("./package-comparer");
var Packaging = (function () {
    function Packaging(typedJson, configJSON, collections) {
        this.typedJson = typedJson;
        this.configJSON = configJSON;
        this.collections = collections;
    }
    Packaging.prototype.packageManagerFor = function (operatingSystemName) {
        switch (operatingSystemName.toLowerCase()) {
            case 'centos':
            case 'redhat': return this.newYumPackageManager();
            case 'ubuntu': return this.newAptPackageManager();
            case 'suse': return this.newZypperPackageManager();
            default: throw new Error("cannot create repository for OS \"" + operatingSystemName);
        }
    };
    Packaging.prototype.newYumConfigFileContent = function () {
        return new yum_config_file_content_1.default();
    };
    Packaging.prototype.newYumPackageManager = function () {
        return new yum_package_manager_1.default(this.newYumConfigFileContent());
    };
    Packaging.prototype.newZypperPackageManager = function () {
        return new zypper_package_manager_1.default(this.newYumConfigFileContent());
    };
    Packaging.prototype.newAptPackageManager = function () {
        return new apt_package_manager_1.default();
    };
    Packaging.prototype.newPromotionLevel = function (levelName) {
        return new promotion_level_1.default(levelName);
    };
    Packaging.prototype.newRepository = function (configJSON, packageSets) {
        return new repository_1.default(configJSON, this, packageSets);
    };
    Packaging.prototype.newRepositories = function (repositoriesJSONList, packageSets) {
        return new repositories_1.default(repositoriesJSONList, this, packageSets);
    };
    Packaging.prototype.newPackage = function (packageJSON) {
        return new package_1.default(packageJSON, this, this.newPackageComparer());
    };
    Packaging.prototype.newPackageComparer = function () {
        return new package_comparer_1.default();
    };
    Packaging.prototype.newSemanticVersion = function (versionString) {
        return new semantic_version_1.default(versionString);
    };
    Packaging.prototype.newPackageSet = function (packageSetConfig, packageSets) {
        return new package_set_1.default(packageSetConfig, this, packageSets);
    };
    Packaging.prototype.newPackageSets = function (listOfPackageSetConfigJSONs) {
        return new package_sets_1.default(listOfPackageSetConfigJSONs, this);
    };
    Packaging.prototype.newPackageFromLiterals = function (name, version, promotionLevel, operatingSystems, tags) {
        return new package_from_literals_1.default(name, this.newSemanticVersion(version), this.newPromotionLevel(promotionLevel), operatingSystems, this.newPackageComparer(), tags);
    };
    Packaging.prototype.newPackageSetRef = function (configJSON, packageSets) {
        return new package_set_reference_1.default(configJSON, this, packageSets);
    };
    Packaging.prototype.newPackageWithOverrides = function (original, operatingSystemsOverride, promotionLevelOverride, tagsOverride) {
        return new package_with_overrides_1.default(original, operatingSystemsOverride, promotionLevelOverride, this.newPackageComparer(), tagsOverride);
    };
    Packaging.prototype.newListOfPackagesFromJSONListOfPackageAndPackageSetRefs = function (listOfPackageAndPackageSetRefJSONs, packageSets) {
        var _this = this;
        return listOfPackageAndPackageSetRefJSONs.flatMap(function (packageJSON) { return packageJSON.hasPropertyNamed('packageSetRef')
            ? _this.newPackageSetRef(packageJSON, packageSets).packages
            : _this.collections.newList([_this.newPackage(packageJSON)]); });
    };
    Object.defineProperty(Packaging.prototype, "defaultPackageSets", {
        get: function () {
            return this.newPackageSets(this.configJSON.listOfJSONObjectsNamed('packageSets'));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Packaging.prototype, "defaultRepositories", {
        get: function () {
            return this.newRepositories(this.configJSON.listOfJSONObjectsNamed('repositories'), this.defaultPackageSets);
        },
        enumerable: true,
        configurable: true
    });
    return Packaging;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Packaging;
//# sourceMappingURL=packaging.js.map