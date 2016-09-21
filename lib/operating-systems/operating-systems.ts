import {IOperatingSystem} from "./i-operating-system";
import {IOperatingSystems} from "./i-operating-systems";
import {OperatingSystem} from "./operating-system";
import {IPackaging} from "../packaging/i-packaging";
import {IOperatingSystemConfig} from "./i-operating-system-config";

export class OperatingSystems implements IOperatingSystems {
    newOperatingSystemFromConfig(config:IOperatingSystemConfig):IOperatingSystem {
        switch(config.name.toLowerCase()) {
            case 'suse': return this.newSuse(config);
            case 'ubuntu': return this.newUbuntu(config);
            case 'centos': return this.newCentos(config);
            default:
                throw new Error(`Could not instantiate operating system for config ${config.toString()}`);
        }
    }

    private newSuse(config:IOperatingSystemConfig):IOperatingSystem {
        return new OperatingSystem(
            config,
            'cat /etc/os-release'
        );
    }

    private newUbuntu(config:IOperatingSystemConfig):IOperatingSystem {
        return new OperatingSystem(
            config,
            'lsb_release -a'
        );
    }

    private newCentos(config:IOperatingSystemConfig):IOperatingSystem {
        return new OperatingSystem(
            config,
            'cat /etc/centos-release'
        );
    }
}