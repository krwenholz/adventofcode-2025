import pino from "pino";

const logger = pino({ level: process.env.LOG_LEVEL ?? "silent" });

export function setVerbose(verbose: boolean): void {
  if (!process.env.LOG_LEVEL) {
    logger.level = verbose ? "debug" : "info";
  }
}

export default logger;
