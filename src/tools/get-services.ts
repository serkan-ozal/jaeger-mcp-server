import { JaegerClient } from '../client';
import { GetServicesResponse } from '../domain';
import { Tool } from './types';

import { Server } from '@modelcontextprotocol/sdk/server/index.js';

export class GetServices implements Tool {
    name(): string {
        return 'get-services';
    }

    description(): string {
        return 'Gets the service names as JSON array of string';
    }

    paramsSchema() {
        return {};
    }

    async handle(
        server: Server,
        jaegerClient: JaegerClient,
        { traceId }: any
    ): Promise<string> {
        const response: GetServicesResponse = await jaegerClient.getServices(
            {}
        );
        return JSON.stringify(response.services);
    }
}
