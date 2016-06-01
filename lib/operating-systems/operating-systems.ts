import IJSONObject from "../typed-json/i-json-object";
import IOperatingSystem from "./i-operating-system";
import IOperatingSystems from "./i-operating-systems";
import IRepositories from "../repositories/i-repositories";
import OperatingSystem from "./operating-system";
import IRepository from "../repositories/i-repository";

export default class OperatingSystems implements IOperatingSystems {
    private repositories:IRepositories;

    constructor(repositories:IRepositories) {
        this.repositories = repositories;
    }

    newOperatingSystemFromConfig(configJSON:IJSONObject):IOperatingSystem {
        switch(configJSON.stringPropertyNamed('name').toLowerCase()) {
            case 'suse': return this.newSuse(configJSON);
            case 'ubuntu': return this.newUbuntu(configJSON);
            case 'centos': return this.newCentos(configJSON);
            default:
                throw new Error(`Could not instantiate operating system for config ${configJSON.toString()}`);
        }
    }

    private newSuse(configJSON:IJSONObject):IOperatingSystem {
        return new OperatingSystem(
            configJSON,
            this.repositories.newZypperRepository(),
            'cat /etc/os-release'
        );
    }

    private newUbuntu(configJSON:IJSONObject):IOperatingSystem {
        return new OperatingSystem(
            configJSON,
            this.repositories.newAptRepository(),
            'lsb_release -a'
        );
    }

    private newCentos(configJSON:IJSONObject):IOperatingSystem {
        return new OperatingSystem(
            configJSON,
            this.repositories.newYumRepository(),
            'cat /etc/centos-release'
        );
    }
}