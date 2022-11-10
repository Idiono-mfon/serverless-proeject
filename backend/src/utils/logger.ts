import * as winston from "winston";

/**
 * Create a logger instance to write log messages in JSON format.
 *
 * @param loggerName - a name of a logger that will be added to all messages
 */
export function createLogger(loggerName: string) {
  return winston.createLogger({
    level: "info",
    format: winston.format.json(),
    defaultMeta: { name: loggerName },
    transports: [
      new winston.transports.Console({
        format: winston.format.combine(
          // Align the logs
          winston.format.align(),
          // Use simple format for the logs
          winston.format.simple(),
          // Log error stack track
          winston.format.errors({ stack: true }),
          // Add the message timestamp with the preferred format
          winston.format.timestamp({ format: "DD-MMM-YYYY HH:mm:ss:ms" }),
          // Define the format of the message showing the timestamp, the level and the message
          winston.format.colorize({ all: true })
        ),
      }),
    ],
  });
}
