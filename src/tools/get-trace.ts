import { z } from 'zod';

import { Tool } from './types';
import { JaegerClient } from '../client';

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
        jaegerClient: JaegerClient,
        { traceId, startTime, endTime }: any
    ): Promise<string> {
        const response: any = await jaegerClient.get(
            `/api/v3/traces/${traceId}`,
            { startTime, endTime }
        );
        return JSON.stringify(response.result.resourceSpans);
    }
}
