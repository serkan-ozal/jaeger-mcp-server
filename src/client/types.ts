import {
    FindTracesRequest,
    FindTracesResponse,
    GetOperationsRequest,
    GetOperationsResponse,
    GetServicesRequest,
    GetServicesResponse,
    GetTraceRequest,
    GetTraceResponse,
} from '../domain';

export type ClientConfigurations = {
    url: string;
    port?: number;
    authorizationHeader?: string;
};

export interface JaegerClient {
    getServices(request: GetServicesRequest): Promise<GetServicesResponse>;
    getOperations(
        request: GetOperationsRequest
    ): Promise<GetOperationsResponse>;
    getTrace(request: GetTraceRequest): Promise<GetTraceResponse>;
    findTraces(request: FindTracesRequest): Promise<FindTracesResponse>;
}
