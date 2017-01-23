import {IMesosClusterConfiguration} from "./i-mesos-cluster-config";
import {IJSONObject} from "../typed-json/i-json-object";

export class MesosClusterConfig implements IMesosClusterConfiguration {

    constructor(
      private mesosClusterJson:IJSONObject
    ){}

    get id():string {
          return this.mesosClusterJson.stringPropertyNamed('id');
    }

    get mesosMasterIP():string {
          return this.mesosClusterJson.stringPropertyNamed('mesosMasterIP');
    }

    get mesosMasterPort():string {
          return this.mesosClusterJson.stringPropertyNamed(`mesosMasterPort`);
    }

    get marathonIP():string {
        return this.mesosClusterJson.stringPropertyNamed(`marathonIP`);
    }

    get marathonPort():string {
        return this.mesosClusterJson.stringPropertyNamed(`marathonPort`);
    }

    get marathonUser():string {
        return this.mesosClusterJson.stringPropertyNamed(`marathonUser`);
    }

    get marathonPassword():string {
        return this.mesosClusterJson.stringPropertyNamed(`marathonPassword`);
    }

    get maprNfsServerIP():string {
        return this.mesosClusterJson.stringPropertyNamed(`maprNfsServerIP`);
    }

    get dockerVolumeMountPath():string {
        return this.mesosClusterJson.stringPropertyNamed(`dockerVolumeMountPath`);
    }

    get dockerVolumeLocalPath():string {
        return this.mesosClusterJson.stringPropertyNamed(`dockerVolumeLocalPath`);
    }

    get mesosSlaves():Array<string> {
          return this.mesosClusterJson.listNamed<string>(`mesosSlaves`).toArray();
    }

    toJSON(): any {
        return null;
    }
}