import {INativeServerResponse} from "./i-native-server-response";

export type INativeServerResponseHandler = (error:Error, response:INativeServerResponse)=>void;