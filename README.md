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
        "JAEGER_URL": "<YOUR_JAEGER_HTTP_OR_GRPC_API_URL>"
      }
    }
  }
}
```


## Configuration

### Environment Variables

- `JAEGER_URL`: HTTP API (`HTTP JSON` (`/api/v3/*`)) or the gRPC API (`gRPC/Protobuf` (`jaeger.api_v3.QueryService`)) URL of the Jaeger instance to access.
- `JAEGER_PORT`: HTTP or gRPC API port of the Jaeger instance to access. The default value is `16685` for the gRPC API and `16686` for the HTTP API.
- `JAEGER_AUTHORIZATION_HEADER`: `Authorization` HTTP header to be added into the requests for querying traces over Jaeger API (for ex. `Basic <Basic Auth Header>`)
- `JAEGER_PROTOCOL`: API protocol of the Jaeger instance to access. Valid values are `GRPC` and `HTTP`. The default value is `GRPC`. Valid
- `JAEGER_USE_DEFAULT_PORT`: If `false`, the Jaeger HTTP client won't attempt to use a port when `JAEGER_PORT` is not set. Default is `true`. 
- `LOG_LEVEL`: Sets the log level from one of [`debug`, `info`, `warn`, `error`, `none`]. Default is `none`.

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
- `find-traces`: Searches the spans as JSON array of object in the OpenTelemetry resource spans format.
    - `serviceName`:
        - `Mandatory`: `true`
        - `Type`: `string`
        - `Description`: Filters spans by OpenTelemetry compatible trace id in 32-character hexadecimal string format
    - `operationName`:
        - `Mandatory`: `false`
        - `Type`: `string`
        - `Description`: The start time to filter spans in the RFC 3339, section 5.6 format, (e.g., `2017-07-21T17:32:28Z`)
    - `attributes`:
        - `Mandatory`: `false`
        - `Type`: `map<string, string | number | boolean>`
        - `Description`: Filters spans by span attributes. Attributes can be passed in key/value format in JSON where 
                         keys can be string and values can be string, number (integer or double) or boolean.
                         For example

            ```json
            {
                "stringAttribute": "str",
                "integerAttribute": 123,
                "doubleAttribute": 123.456,
                "booleanAttribute": true
            }
            ```
   - `startTimeMin`:
       - `Mandatory`: `true`
       - `Type`: `string`
       - `Description`: Start of the time interval (inclusive) in the RFC 3339, section 5.6 format, (e.g., `2017-07-21T17:32:28Z`) for the query. 
                        Only traces with spans that started on or after this time will be returned.
   - `startTimeMax`:
       - `Mandatory`: `true`
       - `Type`: `string`
       - `Description`: End of the time interval (exclusive) in the RFC 3339, section 5.6 format, (e.g., `2017-07-21T17:32:28Z`) for the query. 
                        Only traces with spans that started before this time will be returned.
   - `durationMin`:
       - `Mandatory`: `false`
       - `Type`: `string`
       - `Description`: Minimum duration of a span in **milliseconds** in the trace.
                        Only traces with spans that lasted at least this long will be returned.
   - `durationMax`:
       - `Mandatory`: `false`
       - `Type`: `string`
       - `Description`: Maximum duration of a span in **milliseconds** in the trace.
                        Only traces with spans that lasted at most this long will be returned.
   - `searchDepth`:
       - `Mandatory`: `false`
       - `Type`: `number`
       - `Description`: Defines the maximum search depth.
                        Depending on the backend storage implementation, this may behave like an SQL `LIMIT` clause.
                        However, some implementations might not support precise limits
                        and a larger value generally results in more traces being returned.

### Resources

N/A


## Roadmap

- Support `HTTP Stream` transport protocol (`SSE` transport protocol is deprecated in favor of it) to be able to use the MCP server from remote.
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
