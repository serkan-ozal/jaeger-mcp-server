import { JaegerClient } from '../client';
import { GetOperationsResponse, toSpanKind } from '../domain';
import { Tool } from './types';

import { z } from 'zod';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';

export class GetOperations implements Tool {
    name(): string {
        return 'get-operations';
    }

    description(): string {
        return 'Gets the operations as JSON array of object with "name" and "spanKind" properties';
    }

    paramsSchema() {
        return {
            service: z
                .string()
                .describe('Filters operations by service name (Required)'),
            spanKind: z
                .enum([
                    '',
                    'server',
                    'client',
                    'producer',
                    'consumer',
                    'internal',
                ])
                .describe(
                    'Filters operations by OpenTelemetry span kind ("server", "client", "producer", "consumer", "internal") (Optional)'
                )
                .optional(),
        };
    }

    async handle(
        server: Server,
        jaegerClient: JaegerClient,
        { service, spanKind }: any
    ): Promise<string> {
        const response: GetOperationsResponse =
            await jaegerClient.getOperations({
                service,
                spanKind: toSpanKind(spanKind),
            });
        return JSON.stringify(response.operations);
    }
}
