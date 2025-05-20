import chalk from 'chalk';

const BANNER_TEXT = '[JAEGER-MCP-SERVER]';
const BANNER_BG_COLOR = '#628816';
const BANNER_TEXT_COLOR = '#5ECAE0';

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  NONE = 4
}

export function parseLogLevel(levelStr?: string): LogLevel {
  if (!levelStr) {
      return LogLevel.NONE;
  }
  
  const normalized = levelStr.toLowerCase().trim();
  
  switch (normalized) {
    case 'debug': return LogLevel.DEBUG;
    case 'info': return LogLevel.INFO;
    case 'warn': return LogLevel.WARN;
    case 'error': return LogLevel.ERROR;
    case 'none':
    default: return LogLevel.NONE;
  }
}

// Initialize log level from environment
let currentLogLevel = parseLogLevel(process.env.LOG_LEVEL);

function _timeAsString(): string {
    const date: Date = new Date();
    return `${date.toLocaleTimeString(undefined, {
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: false,
        timeZoneName: 'short',
    })}`;
}

function _normalizeArgs(...args: any[]): any[] {
    if (currentLogLevel === LogLevel.DEBUG) {
        return args;
    } else {
        return (args || []).map((arg) => {
            if (!arg) {
                return '';
            }
            if (
                arg instanceof Error ||
                (arg.name && arg.message && arg.stack)
            ) {
                return `${arg.name}: ${arg.message}`;
            } else {
                return arg;
            }
        });
    }
}

export function getLogLevel(): LogLevel {
    return currentLogLevel;
}

export function setLogLevel(level: LogLevel): void {
    currentLogLevel = level;
}

export function debug(...args: any[]): void {
    if (currentLogLevel > LogLevel.DEBUG) {
        return;
    }
    
    console.debug(
        chalk.bgHex(BANNER_BG_COLOR).hex(BANNER_TEXT_COLOR)(BANNER_TEXT),
        _timeAsString(),
        '|',
        chalk.blue('DEBUG'),
        '-',
        ..._normalizeArgs(...args)
    );
}

export function info(...args: any[]): void {
    if (currentLogLevel > LogLevel.INFO) {
        return;
    }
    
    console.info(
        chalk.bgHex(BANNER_BG_COLOR).hex(BANNER_TEXT_COLOR)(BANNER_TEXT),
        _timeAsString(),
        '|',
        chalk.green('INFO '),
        '-',
        ..._normalizeArgs(...args)
    );
}

export function warn(...args: any[]): void {
    if (currentLogLevel > LogLevel.WARN) {
        return;
    }
    
    console.warn(
        chalk.bgHex(BANNER_BG_COLOR).hex(BANNER_TEXT_COLOR)(BANNER_TEXT),
        _timeAsString(),
        '|',
        chalk.yellow('WARN '),
        '-',
        ..._normalizeArgs(...args)
    );
}

export function error(...args: any[]): void {
    if (currentLogLevel > LogLevel.ERROR) {
        return;
    }
    
    console.error(
        chalk.bgHex(BANNER_BG_COLOR).hex(BANNER_TEXT_COLOR)(BANNER_TEXT),
        _timeAsString(),
        '|',
        chalk.red('ERROR'),
        '-',
        ..._normalizeArgs(...args)
    );
}

function _getCircularReplacer() {
    const seen = new WeakSet();
    return (key: string, value: any) => {
        if (typeof value === 'object' && value !== null) {
            if (seen.has(value)) {
                return;
            }
            seen.add(value);
        }
        return value;
    };
}

export function toJson(obj: any): string {
    return JSON.stringify(obj, _getCircularReplacer());
}
