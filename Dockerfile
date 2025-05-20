FROM node:18-slim

# Install supergateway globally
RUN npm install -g supergateway

# Set up jaeger-mcp
WORKDIR /app

# Copy jaeger-mcp package files
COPY package*.json ./
COPY scripts/ ./scripts/
COPY protos/ ./protos/

# Install dependencies
RUN npm ci

# Copy source files
COPY tsconfig.json ./
COPY src/ ./src/

# Build the application
RUN npm run build && chmod +x ./dist/index.js

# Environment variables
ENV NODE_ENV=production
ENV JAEGER_MCP_SSE_PORT=8000

# Expose port
EXPOSE ${JAEGER_MCP_SSE_PORT}

# Run supergateway with jaeger-mcp
ENTRYPOINT ["sh", "-c", "supergateway --stdio 'node /app/dist/index.js' --port ${JAEGER_MCP_SSE_PORT}"]
