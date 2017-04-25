import {IFramework} from "../common/i-framework";
import {Framework} from "../common/framework";
import {IConsole} from "../../console/i-console";
import {ConsoleForBrowser} from "../../console/console-for-browser";
import {IGrafana} from "../../grafana/i-grafana";
import {IList} from "../../collections/i-list";
import {Assertion} from "../../chai/assertion";
import {IFuture} from "../../futures/i-future";
import {IConfigLoader} from "../common/i-config-loader";
import {IProcess} from "../../node-js-wrappers/i-process";
import {IFileSystem} from "../../node-js-wrappers/i-filesystem";
import {ISSHAPI} from "../../ssh/i-ssh-api";
import {Cli} from "../../cli/cli";
import {ITesting} from "../../testing/i-testing";
import {IFutures} from "../../futures/i-futures";
import {IRest} from "../../rest/common/i-rest";
import {IESXI} from "../../esxi/i-esxi";
import {IClusterTesting} from "../../cluster-testing/i-cluster-testing";
import {ICucumber} from "../../cucumber/i-cucumber";
import {IClusters} from "../../clusters/i-clusters";
import {ICluster} from "../../clusters/i-cluster";
import {Futures} from "../../futures/futures";
import {RESTForBrowser} from "../../rest/browser/rest-for-browser";
import {INodeWrapperFactory} from "../../node-js-wrappers/i-node-wrapper-factory";
import {IMarathon} from "../../marathon/i-marathon";
import {NotImplementedError} from "../../errors/not-implemented-error";
import {IDocker} from "../../docker/i-docker";

export class FrameworkForBrowser extends Framework implements IFramework {
    constructor(
        private nativeConsole:any,
        private nativePromise:any,
        private nativeJQuery:any
    ) {
        super();
    }

    private newNotAvailableInBrowserFrameworkContextError(implementationName:string):Error {
        return new Error(`The requested implementation, ${implementationName}, is not available in the DIA Framework Browser context.`);
    }

    get console():IConsole {
        return new ConsoleForBrowser(this.nativeConsole);
    }

    get futures():IFutures  {
        return new Futures(this.nativePromise, this.collections);
    }

    get rest():IRest  {
        return new RESTForBrowser(
            this.nativeJQuery,
            this.futures,
            this.typedJSON,
            this.collections
        );
    }

    get frameworkConfigLoader():IConfigLoader  {
        throw new NotImplementedError();
    }

    //TODO: Separate out the server only interface or implement browser versions of the below:

    get grafana():IGrafana {
        throw this.newNotAvailableInBrowserFrameworkContextError('grafana');
    }

    get nodeWrapperFactory():INodeWrapperFactory {
        throw this.newNotAvailableInBrowserFrameworkContextError('nodeWrapperFactory');
    }

    get clusterId():string {
        throw this.newNotAvailableInBrowserFrameworkContextError('clusterId');
    }

    get cucumber():ICucumber {
        throw this.newNotAvailableInBrowserFrameworkContextError('cucumber');
    }

    get clusters():IClusters {
        throw this.newNotAvailableInBrowserFrameworkContextError('clusters');
    }

    get clusterUnderTest():ICluster {
        throw this.newNotAvailableInBrowserFrameworkContextError('clusters');
    }

    expect(target: any, message?: string):Assertion  {
        throw this.newNotAvailableInBrowserFrameworkContextError('expect');
    }

    expectAll<T>(target:IList<IFuture<T>>):Assertion  {
        throw this.newNotAvailableInBrowserFrameworkContextError('expectAll');
    }

    expectEmptyList<T>(list:IList<T>):void  {
        throw this.newNotAvailableInBrowserFrameworkContextError('expectEmptyList');
    }

    get process():IProcess {
        throw this.newNotAvailableInBrowserFrameworkContextError('process');
    }

    get fileSystem():IFileSystem  {
        throw this.newNotAvailableInBrowserFrameworkContextError('fileSystem');
    }

    get sshAPI():ISSHAPI  {
        throw this.newNotAvailableInBrowserFrameworkContextError('sshAPI');
    }

    get cli():Cli  {
        throw this.newNotAvailableInBrowserFrameworkContextError('cli');
    }

    get testing():ITesting {
        throw this.newNotAvailableInBrowserFrameworkContextError('testing');
    }

    get esxi():IESXI  {
        throw this.newNotAvailableInBrowserFrameworkContextError('esxi');
    }

    get clusterTesting():IClusterTesting  {
        throw this.newNotAvailableInBrowserFrameworkContextError('clusterTesting');
    }

    get marathon():IMarathon {
        throw this.newNotAvailableInBrowserFrameworkContextError('dockerInfrastructure');
    }

    get docker(): IDocker {
        throw this.newNotAvailableInBrowserFrameworkContextError('Docker');
    }
}