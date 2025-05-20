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
    toSpanKind,
} from '../domain';
import { ClientConfigurations, JaegerClient } from './types';

import axios, { AxiosResponse } from 'axios';

const DEFAULT_PORT = 16686;
const URL_SCHEMA_SEPARATOR: string = '://';
const SECURE_URL_SCHEMA: string = 'https://';
const INSECURE_URL_SCHEMA: string = 'http://';
const SECURE_URL_PORT: number = 443;
const HTTP_STATUS_CODE_NOT_FOUND: number = 404;

export class JaegerHttpClient implements JaegerClient {
    private readonly url: string;
    private readonly authorizationHeader: string | undefined;

    constructor(clientConfigurations: ClientConfigurations) {
        this.url = JaegerHttpClient._normalizeUrl(
            clientConfigurations.url,
            clientConfigurations.port,
            clientConfigurations.allowDefaultPort
        );
        this.authorizationHeader = clientConfigurations.authorizationHeader;
    }

    private static _normalizeUrl(url: string, port?: number, allowDefaultPort?: boolean): string {
        const schemaIdx: number = url.indexOf(URL_SCHEMA_SEPARATOR);
        if (schemaIdx < 0) {
            if (port === SECURE_URL_PORT) {
                url = `${SECURE_URL_SCHEMA}${url}`;
            } else {
                url = `${INSECURE_URL_SCHEMA}${url}`;
            }
        }

        if (port) {
            url = `${url}:${port}`
        } else if (allowDefaultPort) {
            port = url.startsWith(SECURE_URL_SCHEMA)
                ? SECURE_URL_PORT
                : DEFAULT_PORT;
            url = `${url}:${port}`;
        }

        return url;
    }

    private async _get<R>(path: string, params?: any): Promise<R> {
        const response: AxiosResponse = await axios.get(
            `${this.url}${path}`,
            {
                params,
                headers: {
                    Authorization: this.authorizationHeader,
                },
            }
        );
        if (response.status != 200) {
            throw new Error(
                `Request failed with status code ${response.status}`
            );
        }
        return response.data as R;
    }

    private _toDateTimeString(timestamp?: number): string | undefined {
        if (timestamp) {
            return new Date(timestamp).toISOString();
        }
    }

    private _toDurationUnit(durationMs?: number): string | undefined {
        if (durationMs) {
            return `${durationMs}ms`;
        }
    }

    private _normalizeAttribute(attribute: any): any {
        if (typeof attribute.value?.intValue === 'string') {
            attribute.value.intValue = parseInt(
                attribute.value?.intValue as string
            );
        }
        if (typeof attribute.value?.doubleValue === 'string') {
            attribute.value.doubleValue = parseFloat(
                attribute.value?.doubleValue as string
            );
        }
        return attribute;
    }

    private _normalizeResource(resource: any): any {
        resource.attributes = resource.attributes?.map((a: any) => {
            return this._normalizeAttribute(a);
        });
        return resource;
    }

    private _normalizeInstrumentationScope(instrumentationScope: any): any {
        instrumentationScope.attributes = instrumentationScope.attributes?.map(
            (a: any) => {
                return this._normalizeAttribute(a);
            }
        );
        return instrumentationScope;
    }

    private _normalizeEvent(event: any): any {
        event.attributes = event.attributes?.map((a: any) => {
            return this._normalizeAttribute(a);
        });
        return event;
    }

    private _normalizeLink(link: any): any {
        link.attributes = link.attributes?.map((a: any) => {
            return this._normalizeAttribute(a);
        });
        return link;
    }

    private _normalizeSpan(span: any): any {
        if (typeof span.kind === 'number') {
            span.kind = toSpanKind(span.kind as number)?.toString();
        }
        span.attributes = span.attributes?.map((a: any) => {
            return this._normalizeAttribute(a);
        });
        span.events = span.events?.map((a: any) => {
            return this._normalizeEvent(a);
        });
        span.links = span.links?.map((a: any) => {
            return this._normalizeLink(a);
        });
        return span;
    }

    private _normalizeResourceSpans(resourceSpans: any[]): any[] {
        return resourceSpans.map((rs: any) => {
            (rs.resource = this._normalizeResource(rs.resource)),
                (rs.scopeSpans = rs.scopeSpans?.map((ss: any) => {
                    ss.scope = this._normalizeInstrumentationScope(ss.scope);
                    ss.spans = ss.spans?.map((s: any) => {
                        return this._normalizeSpan(s);
                    });
                    return ss;
                }));
            return rs;
        });
    }

    private _handleError<R>(err: any): R {
        if (err.status === HTTP_STATUS_CODE_NOT_FOUND) {
            return {} as R;
        }
        throw err;
    }

    async getServices(
        request: GetServicesRequest
    ): Promise<GetServicesResponse> {
        try {
            const httpResponse: any = await this._get('/api/v3/services');
            return {
                services: httpResponse.services,
            } as GetServicesResponse;
        } catch (err: any) {
            return this._handleError(err);
        }
    }

    async getOperations(
        request: GetOperationsRequest
    ): Promise<GetOperationsResponse> {
        try {
            const httpResponse: any = await this._get('/api/v3/operations', {
                service: request.service,
                span_kind: request.spanKind?.toString().toLowerCase(),
            });
            return {
                operations: httpResponse.operations,
            } as GetOperationsResponse;
        } catch (err: any) {
            return this._handleError(err);
        }
    }

    async getTrace(request: GetTraceRequest): Promise<GetTraceResponse> {
        try {
            const httpResponse: any = await this._get(
                `/api/v3/traces/${request.traceId}`,
                {
                    startTime: this._toDateTimeString(request.startTime),
                    endTime: this._toDateTimeString(request.endTime),
                }
            );
            return {
                resourceSpans: this._normalizeResourceSpans(
                    httpResponse.result.resourceSpans
                ),
            };
        } catch (err: any) {
            return this._handleError(err);
        }
    }

    async findTraces(request: FindTracesRequest): Promise<FindTracesResponse> {
        try {
            const httpResponse: any = await this._get('/api/v3/traces', {
                'query.service_name': request.query.serviceName,
                'query.operation_name': request.query.operationName,
                'query.start_time_min': request.query.startTimeMin,
                'query.start_time_max': request.query.startTimeMax,
                'query.duration_min': this._toDurationUnit(
                    request.query.durationMin
                ),
                'query.duration_max': this._toDurationUnit(
                    request.query.durationMax
                ),
                'query.search_depth': request.query.searchDepth,
            });
            return {
                resourceSpans: this._normalizeResourceSpans(
                    httpResponse.result.resourceSpans
                ),
            };
        } catch (err: any) {
            return this._handleError(err);
        }
    }

    async getServiceGraph(request: GetServiceGraphRequest): Promise<GetServiceGraphResponse> {
        try {
            const httpResponse: any = await this._get('/api/dependencies', {
                'endTs': request.endTS,
                'lookback': request.lookback,
            });

            return {
                graphEdges: httpResponse.data
            } as GetServiceGraphResponse;
        } catch (err: any) {
            return this._handleError(err);
        }
    }
}
