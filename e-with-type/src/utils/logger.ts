import winston, { createLogger, format, Logger, transports } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
const { printf } = format;

import LokiTransport from 'winston-loki';

const logDirectory = 'src/logs';

const customLevels = {
  levels: {
    critical: 0,
    error: 1,
    warn: 2,
    info: 3,
    http: 4,
    debug: 5,
    trace: 6,
  },
  colors: {
    critical: 'bold red',
    warn: 'yellow inverse',
    http: 'bold magenta inverse',
    info: 'bold green inverse',
    error: 'bold red inverse',
    debug: 'blue inverse',
    trace: 'grey inverse',
  },
};

interface CustomLogger extends Logger {
  login_failed: winston.LeveledLogMethod;
  password_changed: winston.LeveledLogMethod;
  http: winston.LeveledLogMethod;
  fatal: winston.LeveledLogMethod;
  critical: winston.LeveledLogMethod;
}

const myFormat = printf(({ message, timestamp, level, stack }) => {
  const date = new Date(timestamp as string);
  const hour = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  return `${date.toDateString()} ${hour}:${minutes}:${seconds}  [${level}] : ${message} ${stack ? `\n ${stack}` : ''}`;
});

const consoleFormat = format.combine(
  format.colorize({ all: true, colors: customLevels.colors }),
  format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  myFormat,
);

const jsonFormat = format.combine(format.timestamp(), format.json());

const lokiTransport = new LokiTransport({
  host: 'http://localhost:3100',
  labels: { app: 'neuronomous-iot', env: 'dev' },
  json: true,
  format: winston.format.json(),
  // Optional: batch logs to reduce network calls
  batching: true,
  interval: 5,
});

export const logger = createLogger({
  levels: customLevels.levels,
  level: 'trace',
  // levels: config.npm.levels,
  // level: "http",
  transports: [
    new transports.Console({
      format: consoleFormat,
    }),
    new DailyRotateFile({
      level: 'info',
      filename: `${logDirectory}/combined-%DATE%.log`,
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d',
      format: jsonFormat,
    }),
    lokiTransport,
  ],
}) as CustomLogger;
