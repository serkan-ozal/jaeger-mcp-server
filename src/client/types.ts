import {
    FindTracesRequest,
    FindTracesResponse,
    GetOperationsRequest,
    GetOperationsResponse,
    GetServiceGraphRequest,
    GetServiceGraphResponse,
    GetServicesRequest,
    GetServicesResponse,
    GetTraceRequest,
    GetTraceResponse,
} from '../domain';

export type ClientConfigurations = {
    url: string;
    port?: number;
    authorizationHeader?: string;
    allowDefaultPort?: boolean;
};

export interface JaegerClient {
    getServices(request: GetServicesRequest): Promise<GetServicesResponse>;
    getOperations(
        request: GetOperationsRequest
    ): Promise<GetOperationsResponse>;
    getTrace(request: GetTraceRequest): Promise<GetTraceResponse>;
    findTraces(request: FindTracesRequest): Promise<FindTracesResponse>;
    getServiceGraph(request: GetServiceGraphRequest): Promise<GetServiceGraphResponse>
}
