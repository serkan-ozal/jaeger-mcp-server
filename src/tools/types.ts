import { z, ZodRawShape, ZodTypeAny } from 'zod';

import { JaegerClient } from '../client';

export type ToolParamsSchema = ZodRawShape;
export type ToolInput = z.objectOutputType<ZodRawShape, ZodTypeAny>;
export type ToolOutput = string;

export interface Tool {
    name(): string;
    description(): string;
    paramsSchema(): ToolParamsSchema;
    handle(jaegerClient: JaegerClient, args: ToolInput): Promise<ToolOutput>;
}
