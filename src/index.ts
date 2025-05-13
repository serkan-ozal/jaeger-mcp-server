#!/usr/bin/env node

import * as logger from './logger';
import { startServer } from './server';

async function main() {
    logger.info('Starting Jaeger MCP server...');
    await startServer();
    logger.info('MCP Server started');
}

main().catch((error) => {
    logger.error(`Server error: ${error}`);
    process.exit(1);
});
