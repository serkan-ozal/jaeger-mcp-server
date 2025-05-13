import { JaegerClient } from '../client';

import { z, ZodRawShape, ZodTypeAny } from 'zod';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';

export type ToolParamsSchema = ZodRawShape;
export type ToolInput = z.objectOutputType<ZodRawShape, ZodTypeAny>;
export type ToolOutput = string;

export interface Tool {
    name(): string;
    description(): string;
    paramsSchema(): ToolParamsSchema;
    handle(
        server: Server,
        jaegerClient: JaegerClient,
        args: ToolInput
    ): Promise<ToolOutput>;
}
