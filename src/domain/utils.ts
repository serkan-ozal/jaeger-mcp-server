import { SpanKind, StatusCode } from './commons';

const spanKindMapByString: { [key: string]: SpanKind } = {
    UNSPECIFIED: SpanKind.UNSPECIFIED,
    INTERNAL: SpanKind.INTERNAL,
    SERVER: SpanKind.SERVER,
    CLIENT: SpanKind.CLIENT,
    PRODUCER: SpanKind.PRODUCER,
    CONSUMER: SpanKind.CONSUMER,
};

const spanKindMapByNumber: { [key: number]: SpanKind } = {
    0: SpanKind.UNSPECIFIED,
    1: SpanKind.INTERNAL,
    2: SpanKind.SERVER,
    3: SpanKind.CLIENT,
    4: SpanKind.PRODUCER,
    5: SpanKind.CONSUMER,
};

const statusCodeMapByString: { [key: string]: StatusCode } = {
    UNSET: StatusCode.UNSET,
    OK: StatusCode.OK,
    ERROR: StatusCode.ERROR,
};

const statusCodeMapByNumber: { [key: number]: StatusCode } = {
    0: StatusCode.UNSET,
    1: StatusCode.OK,
    2: StatusCode.ERROR,
};

export function toSpanKind(
    spanKindAsStrOrNumber?: string | number
): SpanKind | undefined {
    if (spanKindAsStrOrNumber) {
        if (typeof spanKindAsStrOrNumber === 'number') {
            return spanKindMapByNumber[spanKindAsStrOrNumber as number];
        } else {
            return spanKindMapByString[spanKindAsStrOrNumber.toUpperCase()];
        }
    }
}

export function toStatusCode(
    statusCodeAsStrOrNumber?: string | number
): StatusCode | undefined {
    if (statusCodeAsStrOrNumber) {
        if (typeof statusCodeAsStrOrNumber === 'number') {
            return statusCodeMapByNumber[statusCodeAsStrOrNumber as number];
        } else {
            return statusCodeMapByString[statusCodeAsStrOrNumber.toUpperCase()];
        }
    }
}
