import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolResult } from '@modelcontextprotocol/sdk/types.js';

import { JaegerClient } from './client';
import * as logger from './logger';
import { tools, Tool, ToolInput, ToolOutput } from './tools/';

const SERVER_NAME = 'jaeger-mcp-server';
const { version: SERVER_VERSION } = require('../package.json');

function _createJaegerClient(): JaegerClient {
    if (!process.env.JAEGER_URL) {
        throw new Error(
            'No Jaeger URL (by "JAEGER_URL" environment variable) is specified'
        );
    }
    return new JaegerClient(
        process.env.JAEGER_URL!,
        process.env.JAEGER_AUTHORIZATION_HEADER
    );
}

export async function startServer(): Promise<void> {
    const server = new McpServer(
        {
            name: SERVER_NAME,
            version: SERVER_VERSION,
        },
        {
            capabilities: {
                resources: {},
                tools: {},
            },
        }
    );

    const jaegerClient: JaegerClient = _createJaegerClient();

    const createToolCallback = (
        handler: (
            jaegerClient: JaegerClient,
            args: ToolInput
        ) => Promise<ToolOutput>
    ) => {
        return async (args: ToolInput): Promise<CallToolResult> => {
            try {
                const response = await handler(jaegerClient, args);
                return {
                    content: [{ type: 'text', text: response }],
                    isError: false,
                };
            } catch (error: any) {
                return {
                    content: [
                        { type: 'text', text: `Error: ${error.message}` },
                    ],
                    isError: true,
                };
            }
        };
    };

    tools.forEach((t: Tool) => {
        logger.info(`Registering tool ${t.name} ...`);
        server.tool(
            t.name(),
            t.description(),
            t.paramsSchema(),
            createToolCallback(t.handle)
        );
    });

    const transport = new StdioServerTransport();
    await server.connect(transport);
}
