declare module "path";
declare module "fs";

declare interface LogittLogData {
  date: string;
  level: string;
  message: string;
  trace: any[];
  meta: any;
}

declare type ConsolaLevel = "success" | "debug" | "warn" | "error";

declare type Level = "all" | "error" | "warn" | "debug";

declare type Period = "week" | "month" | "all";

declare interface LogittConfig {
  trace: boolean;
  route: string;
}
