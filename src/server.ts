import { createClient, JaegerClient } from './client';
import * as logger from './logger';
import { Tool, ToolInput, getTools } from './tools/';

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolResult } from '@modelcontextprotocol/sdk/types.js';

const SERVER_NAME = 'jaeger-mcp-server';
const { version: SERVER_VERSION } = require('../package.json');

function _createJaegerClient(): JaegerClient {
    if (!process.env.JAEGER_URL) {
        throw new Error(
            'No Jaeger URL (by "JAEGER_URL" environment variable) is specified'
        );
    }
    return createClient({
        url: process.env.JAEGER_URL!,
        port: process.env.JAEGER_PORT
            ? parseInt(process.env.JAEGER_PORT)
            : undefined,
        authorizationHeader: process.env.JAEGER_AUTHORIZATION_HEADER,
        allowDefaultPort: process.env.JAEGER_USE_DEFAULT_PORT !== 'false'
    });
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
                logging: {},
            },
        }
    );

    const jaegerClient: JaegerClient = _createJaegerClient();

    const createToolCallback = (tool: Tool) => {
        return async (args: ToolInput): Promise<CallToolResult> => {
            try {
                const response = await tool.handle(
                    server.server,
                    jaegerClient,
                    args
                );
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

    const isGRPC = !process.env.JAEGER_PROTOCOL || process.env.JAEGER_PROTOCOL.toUpperCase() === 'GRPC';
    getTools(isGRPC).forEach((t: Tool) => {
        logger.info(`Registering tool ${t.name} ...`);
        server.tool(
            t.name(),
            t.description(),
            t.paramsSchema(),
            createToolCallback(t)
        );
    });

    const transport = new StdioServerTransport();
    await server.connect(transport);
}
