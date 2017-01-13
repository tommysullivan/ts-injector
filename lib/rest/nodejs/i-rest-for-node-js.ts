import {IRestResponse} from "../common/i-rest-response";
import {INativeServerRequestor} from "./i-native-server-requestor";
import {INativeServerResponse} from "./i-native-server-response";
import {IRest} from "../common/i-rest";

export interface IRestForNodeJS extends IRest {
    newNativeServerRequestor():INativeServerRequestor;
    newRestResponse(error:Error, nativeResponse:INativeServerResponse, originalURL:string):IRestResponse;
}