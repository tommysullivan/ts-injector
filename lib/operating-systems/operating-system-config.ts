import IOperatingSystemConfig from "./i-operating-system-config";
import IRepository from "../repositories/i-repository";
import YumRepository from "../repositories/yum-repository";
import AptRepository from "../repositories/apt-repository";
import IJSONObject from "../typed-json/i-json-object";

export default class OperatingSystemConfig implements IOperatingSystemConfig {
    private operatingSystemJSON:IJSONObject;

    constructor(operatingSystemJSON:IJSONObject) {
        this.operatingSystemJSON = operatingSystemJSON;
    }

    get name():string {
        return this.operatingSystemJSON.stringPropertyNamed('name');
    }


    get version():string {
        return this.operatingSystemJSON.stringPropertyNamed('version');
    }

    get systemInfoCommand():string {
        return {
            "suse": "cat /etc/os-release",
            "centos": "cat /etc/centos-release",
            "ubuntu": "lsb_release -a"

        }[this.name.toLowerCase()];
    }

    get repository():IRepository {
        var hostOS = this.name.toLowerCase();
        var isYum = hostOS == 'centos' || hostOS == 'redhat';
        return isYum
            ? new YumRepository()
            : new AptRepository();
    }
}