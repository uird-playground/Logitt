import consola from "consola";
import fs from "fs";
import path from "path";
import ejs from "ejs";
import { getAppRootDir, parseQuery, readLogs, userHaveAccess } from "./helpers";
import prependFile from "prepend-file";
require("dotenv").config();

export class Logitt {
  env: string;
  logDir: string;
  trace: boolean;

  constructor({ trace = true }: LogittConfig) {
    this.env = process.env.NODE_ENV || "development";
    this.logDir = path.join(getAppRootDir(), "logs");
    this.trace = trace;
    if (this.env === "production" && !fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir);
    }
  }

  private log(
    level: ConsolaLevel,
    message: string,
    meta: any = {},
    trace: any[] = []
  ) {
    const logData: LogittLogData = {
      date: new Date().toISOString(),
      level: level.toUpperCase(),
      message: message,
      trace,
      meta,
    };

    if (this.env === "development") {
      delete meta["trace"];
      consola[level == "debug" ? "info" : level](
        JSON.stringify({ message, ...meta })
      );
    } else if (this.env === "production") {
      this.writeLogToFile(logData);
    }
  }

  writeLogToFile(logData: LogittLogData) {
    const logMessage = JSON.stringify(logData) + "\n";
    const logFileName = path.join(
      this.logDir,
      `${new Date().toISOString().split("T")[0]}.log`
    );
    prependFile.sync(logFileName, logMessage);
  }

  success(message: string, meta: any = {}) {
    consola.success(JSON.stringify({ message, ...meta }));
  }

  debug(message: string, meta: any = {}) {
    let trace: any[] = [];
    if (this.trace) {
      const stack = new Error().stack;
      const stackLines = stack
        ? stack
            .split("\n")
            .slice(2)
            .map((item) => item.trim())
        : [];
      trace = stackLines;
    }
    this.log("debug", message, meta, trace);
  }

  warn(message: string, meta: any = {}) {
    let trace: any[] = [];
    if (this.trace) {
      const stack = new Error().stack;
      const stackLines = stack
        ? stack
            .split("\n")
            .slice(2)
            .map((item) => item.trim())
        : [];
      trace = stackLines;
    }
    this.log("warn", message, meta, trace);
  }

  error(message: string, meta: any = {}) {
    let trace: any[] = [];
    if (this.trace) {
      const stack = new Error().stack;
      const stackLines = stack
        ? stack
            .split("\n")
            .slice(2)
            .map((item) => item.trim())
        : [];
      trace = stackLines;
    }
    this.log("error", message, meta, trace);
  }

  async render(req: any, res: any) {
    let query = await parseQuery(req);
    const logsPath = path.join(__dirname, "views", "logs.ejs");
    const loginPath = path.join(__dirname, "views", "login.ejs");

    try {
      await userHaveAccess(query);
      const data = await readLogs(query.period, query.level);
      let html = await ejs.renderFile(logsPath, { data, ...query });
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(html);
    } catch (error) {
      let html = await ejs.renderFile(loginPath, {
        error: query.username ? error : undefined,
      });
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(html);
    }
  }
}
