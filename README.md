# Jaeger MCP Server

![Build Status](https://github.com/serkan-ozal/jaeger-mcp-server/actions/workflows/build.yml/badge.svg)
![NPM Version](https://badge.fury.io/js/jaeger-mcp-server.svg)
![License](https://img.shields.io/badge/license-MIT-blue)

MCP Server for [Jaeger](https://www.jaegertracing.io/).


## Prerequisites
- Node.js 18+


## Quick Start

This MCP server (using `STDIO` transport) can be added to any MCP Client 
like VS Code, Claude, Cursor, Windsurf Github Copilot via the `jaeger-mcp-server` NPM package.

### VS Code

```json
{
  "servers": {
    "jaeger-mcp-server": {
      "command": "npx",
      "args": ["-y", "jaeger-mcp-server"],
      "envFile": "${workspaceFolder}/.env"
    }
  }
}
```

### Claude Desktop
```json
{
  "mcpServers": {
    "jaeger-mcp-server": {
      "command": "npx",
      "args": ["-y", "jaeger-mcp-server"],
      "env": {
        "JAEGER_URL": "<YOUR_JAEGER_HTTP_URL>"
      }
    }
  }
}
```


## Configuration

### Environment Variables

- `JAEGER_URL`: HTTP URL of the Jaeger instance to access.
- `JAEGER_AUTHORIZATION_HEADER`: `Authorization` HTTP header to be added into the requests for querying traces over Jaeger API (for ex. `Basic <Basic Auth Header>`)


## Components

### Tools

- `get-operations`: Gets the operations as JSON array of object with `name` and `spanKind` properties.
  Supports the following input parameters:
    - `service`:
        - `Mandatory`: `true`
        - `Type`: `string`
        - `Description`: Filters operations by service name
    - `spanKind`:
        - `Mandatory`: `false`
        - `Type`: `string`
        - `Description`: Filters operations by OpenTelemetry span kind (`server`, `client`, `producer`, `consumer`, `internal`)
- `get-services`: Gets the service names as JSON array of string.
  No input parameter supported.
- `get-trace`: Gets the spans by the given trace by ID as JSON array of object in the OpenTelemetry resource spans format.
    - `traceId`:
        - `Mandatory`: `true`
        - `Type`: `string`
        - `Description`: Filters spans by OpenTelemetry compatible trace id in 32-character hexadecimal string format
    - `startTime`:
        - `Mandatory`: `false`
        - `Type`: `string`
        - `Description`: The start time to filter spans in the RFC 3339, section 5.6 format, (e.g., `2017-07-21T17:32:28Z`)
    - `endTime`:
        - `Mandatory`: `false`
        - `Type`: `string`
        - `Description`: The end time to filter spans in the RFC 3339, section 5.6 format, (e.g., `2017-07-21T17:32:28Z`)
- `get-traces`: Searches the spans as JSON array of object in the OpenTelemetry resource spans format.
    - `serviceName`:
        - `Mandatory`: `true`
        - `Type`: `string`
        - `Description`: Filters spans by OpenTelemetry compatible trace id in 32-character hexadecimal string format
    - `operationName`:
        - `Mandatory`: `false`
        - `Type`: `string`
        - `Description`: The start time to filter spans in the RFC 3339, section 5.6 format, (e.g., `2017-07-21T17:32:28Z`)
    - `startTimeMin`:
        - `Mandatory`: `true`
        - `Type`: `string`
        - `Description`: The end time to filter spans in the RFC 3339, section 5.6 format, (e.g., `2017-07-21T17:32:28Z`)
    - `startTimeMax`:
        - `Mandatory`: `true`
        - `Type`: `string`
        - `Description`: The end time to filter spans in the RFC 3339, section 5.6 format, (e.g., `2017-07-21T17:32:28Z`)
    - `durationMin`:
        - `Mandatory`: `false`
        - `Type`: `string`
        - `Description`: The end time to filter spans in the RFC 3339, section 5.6 format, (e.g., `2017-07-21T17:32:28Z`)
    - `durationMax`:
        - `Mandatory`: `false`
        - `Type`: `string`
        - `Description`: The end time to filter spans in the RFC 3339, section 5.6 format, (e.g., `2017-07-21T17:32:28Z`)
    - `searchDepth`:
        - `Mandatory`: `false`
        - `Type`: `number`
        - `Description`: The end time to filter spans in the RFC 3339, section 5.6 format, (e.g., `2017-07-21T17:32:28Z`)

### Resources

N/A


## Roadmap

- Migrate to the Jaeger's `gRPC/Protobuf` (Stable) API from `HTTP JSON` (internal) API for better search capabilities.
- Support more tools which are not directly available over Jaeger API (orchestrating and pipelining multiple API endpoints)


## Issues and Feedback

[![Issues](https://img.shields.io/github/issues/serkan-ozal/jaeger-mcp-server.svg)](https://github.com/serkan-ozal/jaeger-mcp-server/issues?q=is%3Aopen+is%3Aissue)
[![Closed issues](https://img.shields.io/github/issues-closed/serkan-ozal/jaeger-mcp-server.svg)](https://github.com/serkan-ozal/jaeger-mcp-server/issues?q=is%3Aissue+is%3Aclosed)

Please use [GitHub Issues](https://github.com/serkan-ozal/jaeger-mcp-server/issues) for any bug report, feature request and support.


## Contribution

[![Pull requests](https://img.shields.io/github/issues-pr/serkan-ozal/jaeger-mcp-server.svg)](https://github.com/serkan-ozal/jaeger-mcp-server/pulls?q=is%3Aopen+is%3Apr)
[![Closed pull requests](https://img.shields.io/github/issues-pr-closed/serkan-ozal/jaeger-mcp-server.svg)](https://github.com/serkan-ozal/jaeger-mcp-server/pulls?q=is%3Apr+is%3Aclosed)
[![Contributors](https://img.shields.io/github/contributors/serkan-ozal/jaeger-mcp-server.svg)]()

If you would like to contribute, please
- Fork the repository on GitHub and clone your fork.
- Create a branch for your changes and make your changes on it.
- Send a pull request by explaining clearly what is your contribution.

> Tip:
> Please check the existing pull requests for similar contributions and
> consider submit an issue to discuss the proposed feature before writing code.

## License

Licensed under [MIT](LICENSE).
