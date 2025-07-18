import { Tool, ToolInput, ToolOutput, ToolParamsSchema } from './types';
import { GetOperations } from './get-operations';
import { GetServices } from './get-services';
import { GetTrace } from './get-trace';
import { FindTraces } from './find-traces';

export const tools: Tool[] = [
    new GetOperations(),
    new GetServices(),
    new GetTrace(),
    new FindTraces(),
];

export { Tool, ToolInput, ToolOutput, ToolParamsSchema };
