import IRepositoryUrlProvider from "./i-repository-url-provider";
import ITypedJSON from "../typed-json/i-typed-json";

export default class RepositoryUrlProvider implements IRepositoryUrlProvider {
    private typedJson:ITypedJSON;

    constructor(typedJson:ITypedJSON) {
        this.typedJson = typedJson;
    }

    urlFor(phase:string, coreVersion:string, operatingSystem:string, componentFamily:string):string {
        return phase=='dev'
            ? `http://${this.basePathDuringDevPhase(operatingSystem, componentFamily)}/${this.productLocationDuringDevPhase(operatingSystem, componentFamily)}`
            : `http://${this.basePathAfterDevPhase(phase, componentFamily)}/${this.productLocationAfterDevPhase(operatingSystem, componentFamily, coreVersion)}`;
    }

    private basePathDuringDevPhase(operatingSystem:string, componentFamily:string):string {
        return componentFamily=='MEP'
            ? 'artifactory.devops.lab'
            : this.typedJson.newJSONObject({
                'ubuntu': 'apt.qa.lab',
                'redhat': 'yum.qa.lab',
                'suse': 'yum.qa.lab'
            }).stringPropertyNamed(operatingSystem);
    }

    private basePathAfterDevPhase(phase:string, componentFamily:string):string {
        return this.typedJson.newJSONObject({
            'production': 'package.mapr.com/releases',
            'staging': componentFamily=='spyglass' ? 'spyglass:monitoring@stage.mapr.com/beta' : 'maprqa:maprqa@stage.mapr.com/mapr',
            'limited beta': 'spyglass:monitoring@stage.mapr.com/beta'
        }).stringPropertyNamed(phase);
    }

    private productLocationDuringDevPhase(operatingSystem:string, componentFamily:string):string {
        return this.typedJson.newJSONObject({
            'core': operatingSystem=='suse' ? 'mapr-suse' : 'mapr',
            'ecosystem': 'opensource',
            'spyglass': 'opensource/spyglass-beta',
            'MEP': `artifactory/list/prestage/releases-dev/MEP/MEP-1.0.0/${operatingSystem}`,
            'mapr-patch': 'v5.1.0-spyglass',
            'installer': 'installer-master-ui'
        }).stringPropertyNamed(componentFamily);
    }

    private productLocationAfterDevPhase(operatingSystem:string, componentFamily:string, coreVersion:string):string {
        var productLocation = this.typedJson.newJSONObject({
            'core': `v${coreVersion}`,
            'ecosystem': 'ecosystem-5.x',
            'spyglass': 'spyglass',
            'MEP': 'MEP/MEP-1.0.0',
            'mapr-patch': 'spyglass',
            'installer': 'installer'
        }).stringPropertyNamed(componentFamily);
        return `${productLocation}/${operatingSystem}`;
    }
}