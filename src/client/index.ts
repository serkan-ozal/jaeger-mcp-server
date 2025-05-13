import { JaegerGrpcClient } from './jaeger-grpc-client';
import { JaegerHttpClient } from './jaeger-http-client';
import { ClientConfigurations, JaegerClient } from './types';

export { JaegerClient };

export function createClient(
    clientConfigurations: ClientConfigurations
): JaegerClient {
    if (process.env.JAEGER_PROTOCOL) {
        if (process.env.JAEGER_PROTOCOL.toUpperCase() === 'GRPC') {
            return new JaegerGrpcClient(clientConfigurations);
        } else if (process.env.JAEGER_PROTOCOL.toUpperCase() === 'HTTP') {
            return new JaegerHttpClient(clientConfigurations);
        } else {
            throw new Error(
                `Invalid Jaeger protocol: ${process.env.JAEGER_PROTOCOL}`
            );
        }
    }
    return new JaegerGrpcClient(clientConfigurations);
}
