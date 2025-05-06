import { z } from 'zod';

import { Tool } from './types';
import { JaegerClient } from '../client';

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
                .enum(['server', 'client', 'producer', 'consumer', 'internal'])
                .describe(
                    'Filters operations by OpenTelemetry span kind ("server", "client", "producer", "consumer", "internal") (Optional)'
                )
                .optional(),
        };
    }

    async handle(
        jaegerClient: JaegerClient,
        { service, spanKind }: any
    ): Promise<string> {
        const response: any = await jaegerClient.get('/api/v3/operations', {
            service,
            span_kind: spanKind,
        });
        return JSON.stringify(response.operations);
    }
}
