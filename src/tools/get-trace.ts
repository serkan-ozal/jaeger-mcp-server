import { JaegerClient } from '../client';
import { GetTraceResponse } from '../domain';
import { Tool } from './types';

import { z } from 'zod';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';

export class GetTrace implements Tool {
    name(): string {
        return 'get-trace';
    }

    description(): string {
        return 'Gets the spans by the given trace by ID as JSON array of object in the OpenTelemetry resource spans format';
    }

    paramsSchema() {
        return {
            traceId: z
                .string()
                .describe(
                    'Filters spans by OpenTelemetry compatible trace id in 32-character hexadecimal string format (Required)'
                )
                .regex(
                    new RegExp(/^[0-9a-fA-F]{32}$/),
                    'Trace id must be in 32-character hexadecimal string format'
                ),
            startTime: z
                .string()
                .datetime()
                .describe(
                    'The start time to filter spans in the RFC 3339, section 5.6 format, (e.g., "2017-07-21T17:32:28Z") (Optional)'
                )
                .optional(),
            endTime: z
                .string()
                .datetime()
                .describe(
                    'The end time to filter spans in the RFC 3339, section 5.6 format, (e.g., "2017-07-21T17:32:28Z") (Optional)'
                )
                .optional(),
        };
    }

    async handle(
        server: Server,
        jaegerClient: JaegerClient,
        { traceId, startTime, endTime }: any
    ): Promise<string> {
        const response: GetTraceResponse = await jaegerClient.getTrace({
            traceId,
            startTime: startTime ? Date.parse(startTime) : undefined,
            endTime: endTime ? Date.parse(endTime) : undefined,
        });
        return JSON.stringify(response.resourceSpans || {});
    }
}
