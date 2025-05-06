import { Tool } from './types';
import { JaegerClient } from '../client';

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
        jaegerClient: JaegerClient,
        { traceId }: any
    ): Promise<string> {
        const response: any = await jaegerClient.get('/api/v3/services');
        return JSON.stringify(response.services);
    }
}
