import exp = require("constants");
import {ChildProcess} from "child_process";

export enum HTTP_METHODS {
    get = 'GET',
    post = 'POST',
    put = 'PUT',
    delete = 'DELETE',
    options = 'OPTIONS'
}

export interface ParsedRequest {
    headers: Object;
    url: string;
    method: HTTP_METHODS | string;
}

export interface ITransport {
    isPermanentConnection: boolean;
    port: number;
}

export interface IServerHandlerOptions {
    transport: ITransport;
    cluster?: ICluster;
}

export interface ICluster {
    replicas?: number;
}

export interface IRandomWorker {
    worker: ChildProcess;
    index: number;
}
