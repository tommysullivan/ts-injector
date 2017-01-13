import {IConsole} from "../console/i-console";
import {IFileSystem} from "../node-js-wrappers/i-filesystem";

export class ClusterCliGenerator{

    private defaultUserName = "root";
    private defaultPassword = "mapr";
    private deafultNodeName = "node1";
    private defaultNodeCount = 1;

    constructor(
        private console:IConsole,
        private fileSystem:IFileSystem
    )
    {}

    generateClusterJson():void{

        const nodeCount = this.console.askQuestion("Enter number of nodes in the cluster [1/3/5/10] ?");

        // TODO: Needs to be edited later to support multiple nodes
        const nodeJsonAsString:string = nodeCount == "1" ?
            JSON.stringify(this.fileSystem.readJSONFileSync("data/topologies/singleNode.json"), null ,3) : null;

        //Provide another option for spyglass

        const clusterID = this.console.askQuestion("Enter a unique ID for your cluster ?");
        const clustIdRepString:string  = nodeJsonAsString.replace(/\bclusterID\b/g, clusterID);

        const nodeIP = this.console.askQuestion("Enter IP of the nodes [comma separated]: ");
        const nodeIPRepString:string  = clustIdRepString.replace(/\bnode1IP\b/g, nodeIP);

        const nodeUserName = this.console.askQuestion("Enter the user name for node (default: root) : ");
        const nodeUsrRepString = nodeUserName ?
            nodeIPRepString.replace("${node1userName}",nodeUserName) : nodeIPRepString.replace("${node1userName}", this.defaultUserName);

        const nodePassword = this.console.askQuestion("Enter the password for node (default: mapr) : ");
        const nodePwdRepString = nodePassword ?
            nodeUsrRepString.replace("${node1password}", nodePassword) : nodeUsrRepString.replace("${node1password}", this.defaultPassword);

        const nodeOS = this.console.askQuestion("Enter the OS for node : ");
        const nodeOSRepString:string  = nodePwdRepString.replace("${node1OS}", nodeOS);

        const nodeOSVersion = this.console.askQuestion("Enter the OS Version for node : ");
        const nodeOSVerRepString:string  = nodeOSRepString.replace("${node1Version}", nodeOSVersion);
        
        this.fileSystem.writeFileSync(`./${clusterID}.json`, nodeOSVerRepString);
        console.log(`Config file generated in the current directory`);
        console.log(`NOTE: To use this configuration when running automation, first run the following:`);
        console.log(`export configPath={fullPathToCurrentDirectory}/${clusterID}.json`);
        console.log('');
    }
}
