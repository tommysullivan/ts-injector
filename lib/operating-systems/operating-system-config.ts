import IOperatingSystemConfig from "./i-operating-system-config";
import IRepository from "../repositories/i-repository";
import YumRepository from "../repositories/yum-repository";
import AptRepository from "../repositories/apt-repository";
import IJSONObject from "../typed-json/i-json-object";
import ICollections from "../collections/i-collections";
import ZypperRepository from "../repositories/zypper-repository";

export default class OperatingSystemConfig implements IOperatingSystemConfig {
    private operatingSystemJSON:IJSONObject;
    private collections:ICollections;

    constructor(operatingSystemJSON:IJSONObject, collections:ICollections) {
        this.operatingSystemJSON = operatingSystemJSON;
        this.collections = collections;
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
        switch (hostOS) {
            case "centos":
                return new YumRepository();
            case "ubuntu":
                return new AptRepository(this.collections);
            case "suse":
                return new ZypperRepository();
            default:
                console.log("Could not Identify OS .. returning centos :");
                return new YumRepository();
        }
    }
}