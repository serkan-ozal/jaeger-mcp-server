export type Value = {
    stringValue?: string;
    boolValue?: boolean;
    intValue?: number;
    doubleValue?: number;
};

export type Attribute = {
    key: string;
    value: Value;
};

export enum SpanKind {
    UNSPECIFIED = 'unspecified',
    INTERNAL = 'internal',
    SERVER = 'server',
    CLIENT = 'client',
    PRODUCER = 'producer',
    CONSUMER = 'consumer',
}

export type Status = {
    code: StatusCode;
    message?: string;
};

export enum StatusCode {
    UNSET = 0,
    OK = 1,
    ERROR = 2,
}

export type Event = {
    name: string;
    timeUnixNano: string;
    attributes?: Attribute[];
    droppedAttributesCount?: number;
};

export type Link = {
    traceId: string;
    spanId: string;
    traceState?: string;
    attributes?: Attribute[];
    droppedAttributesCount?: number;
};

export type InstrumentationScope = {
    name: string;
    version?: string;
    attributes?: Attribute[];
    droppedAttributesCount?: number;
};

export type Resource = {
    attributes: Attribute[];
    droppedAttributesCount?: number;
};

export type Span = {
    traceId: string;
    spanId: string;
    traceState?: string;
    parentSpanId?: string;
    name: string;
    kind: SpanKind;
    startTimeUnixNano: string;
    endTimeUnixNano: string;
    attributes?: Attribute[];
    droppedAttributesCount?: number;
    events?: Event[];
    droppedEventsCount?: number;
    links?: Link[];
    droppedLinksCount?: number;
    status?: Status;
};

export type ScopeSpans = {
    scope: InstrumentationScope;
    spans: Span[];
    schemaUrl?: string;
};

export type ResourceSpans = {
    resource: Resource;
    scopeSpans: ScopeSpans[];
    schemaUrl?: string;
};

export type ServiceGraphEdge = {
    parent: string;
    child: string;
    callCount: number;
};
