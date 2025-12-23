import pino from "pino";
import pretty from "pino-pretty";

const level = process.env.LOG_LEVEL ?? "silent";

const logger = pino({ level }, pretty({ colorize: true }));

export function setVerbose(verbose: boolean): void {
  if (!process.env.LOG_LEVEL) {
    logger.level = verbose ? "debug" : "info";
  }
}

export default logger;
