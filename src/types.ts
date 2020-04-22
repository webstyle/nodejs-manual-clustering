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

export enum TransportTypes {
    http = 'HTTP',
    tcp = 'TCP'
}

export interface ITransport {
    isPermanentConnection: boolean;
    port: number;
    type: TransportTypes
}

export interface IServerHandlerOptions {
    transport: ITransport;
    cluster?: ICluster;
}

export interface ICluster {
    replicas?: number;
}
