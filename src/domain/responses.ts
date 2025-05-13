import { ResourceSpans, SpanKind } from './commons';

export type Operation = {
    name: string;
    spanKind: SpanKind;
};

export type GetServicesResponse = {
    services: string[];
};

export type GetOperationsResponse = {
    operations: Operation[];
};

export type GetTraceResponse = {
    resourceSpans: ResourceSpans[];
};

export type FindTracesResponse = {
    resourceSpans: ResourceSpans[];
};
