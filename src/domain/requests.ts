import { SpanKind } from './commons';

export type GetServicesRequest = {};

export type GetOperationsRequest = {
    service: string;
    spanKind?: SpanKind;
};

export type GetTraceRequest = {
    traceId: string;
    startTime?: number;
    endTime?: number;
    rawTraces?: boolean;
};

export type TraceQueryParameters = {
    serviceName: string;
    operationName?: string;
    attributes?: { [k: string]: string };
    startTimeMin: number;
    startTimeMax: number;
    durationMin?: number;
    durationMax?: number;
    searchDepth?: number;
    rawTraces?: boolean;
};

export type FindTracesRequest = {
    query: TraceQueryParameters;
};

export type GetServiceGraphRequest = {
    endTS: number;
    lookback: number;
};
