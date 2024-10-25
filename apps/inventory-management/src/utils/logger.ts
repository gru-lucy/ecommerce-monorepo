import pino from 'pino';

/**
 * Logger configuration using Pino for structured logging.
 *
 * The logger is configured to output logs at the specified log level
 * defined in the environment variable LOG_LEVEL. If not specified,
 * it defaults to 'info'. The logs are formatted using the pino-pretty
 * transport for better readability in the console.
 */
export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
    },
  },
});
