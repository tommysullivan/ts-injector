import IOperatingSystem from "./i-operating-system";
import IJSONObject from "../typed-json/i-json-object";

interface IOperatingSystems {
    newOperatingSystemFromConfig(configJSON:IJSONObject):IOperatingSystem;
}

export default IOperatingSystems;