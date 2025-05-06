#!/usr/bin/env node

import { startServer } from './server';
import * as logger from './logger';

async function main() {
    logger.info('Initializing Jaeger MCP server...');

    await startServer();
    logger.info('MCP Server started');
}

main().catch((error) => {
    logger.error(`Server error: ${error}`);
    process.exit(1);
});
