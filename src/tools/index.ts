import { Tool, ToolInput, ToolOutput, ToolParamsSchema } from './types';
import { GetOperations } from './get-operations';
import { GetServices } from './get-services';
import { GetTrace } from './get-trace';
import { FindTraces } from './find-traces';
import { GetServiceGraph } from './get-service-graph';

export const tools: Tool[] = [
    new GetOperations(),
    new GetServices(),
    new GetTrace(),
    new FindTraces(),
];

export const httpOnlyTools: Tool[] = [
    new GetServiceGraph(),
];

export function getTools(isGRPC: boolean): Tool[] {
    return isGRPC ? tools : [...tools, ...httpOnlyTools];
}

export { Tool, ToolInput, ToolOutput, ToolParamsSchema };
