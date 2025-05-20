import { Tool } from './types';
import { JaegerClient } from '../client';
import { GetServiceGraphResponse } from '../domain';

import { z } from 'zod';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';

export class GetServiceGraph implements Tool {
    name(): string {
        return 'get-service-graph';
    }

    description(): string {
        return 'Gets the service graphs as a JSON array of graph edges represented as tuples (caller, callee, count). Internal HTTP - not officially support by Jaeger HTTP API';
    }

    paramsSchema() {
        return {
            endTs: z
                .number()
                .positive()
                .describe(
                    '(number of milliseconds since epoch) - the end of the time interval'
                ),
            lookback: z
                .number()
                .positive()
                .describe(
                    '(in milliseconds) - the length the time interval (i.e. start-time + lookback = end-time).'
                )
        };
    }

    async handle(
        server: Server,
        jaegerClient: JaegerClient,
        {
            endTs,
            lookback,
        }: any,
    ): Promise<string> {
        const response: GetServiceGraphResponse = await jaegerClient.getServiceGraph(
            {
                endTS: endTs,
                lookback: lookback,
            }
        );
        return JSON.stringify(response.graphEdges);
    }
}