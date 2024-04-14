import { existsSync, mkdirSync } from "fs";
import { join } from "path";
import { LOG_DIR } from "@/config/config";
import winstonDaily from "winston-daily-rotate-file";
import winston from "winston";

const logDir: string = join(__dirname, LOG_DIR);

if (!existsSync(logDir)) {
  mkdirSync(logDir);
}

const logsFormat = winston.format.printf(
  ({ timestamp, level, message }) => `${timestamp}:${level}:: ${message}`
);

const log = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss",
    }),
    logsFormat
  ),
  transports: [
    new winstonDaily({
      level: "error",
      datePattern: "YYYY-MM-DD",
      dirname: logDir + "/error",
      filename: "%DATE%.error.log",
      maxFiles: 29,
      zippedArchive: true,
      json: false,
    }),
    new winstonDaily({
      level: "debug",
      datePattern: "YYYY-MM-DD",
      dirname: logDir + "/debug",
      filename: "%DATE%.debug.log",
      maxFiles: 29,
      zippedArchive: true,
      json: false,
    }),
  ],
});

log.add(
  new winston.transports.Console({
    format: winston.format.combine(
      winston.format.label(),
      winston.format.splat(),
      winston.format.colorize(),
      logsFormat
    ),
  })
);

const stream = {
  write: (message: string) => {
    log.info(message.substring(0, message.lastIndexOf("\n")));
  },
};

export { log, stream };
