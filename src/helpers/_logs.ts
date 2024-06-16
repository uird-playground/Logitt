import path from "path";
import fs from "fs";
import { getAppRootDir } from ".";

const getDatesArray = (numDays: number): string[] => {
  const dates = [];
  for (let i = 0; i < numDays; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    dates.push(date.toISOString().split("T")[0]);
  }
  return dates;
};

const readLogsFromDate = (date: string, level: Level): any[] => {
  const logFilePath = path.join(getAppRootDir(), "logs", `${date}.log`);
  if (!fs.existsSync(logFilePath)) return [];

  let logs = fs
    .readFileSync(logFilePath, "utf8")
    .split("\n")
    .filter(Boolean)
    .map((line: string) => {
      const logEntry = JSON.parse(line);
      let meta = Object.keys(logEntry.meta ?? {});
      return {
        ...logEntry,
        date: new Date(logEntry.date).toDateString(),
        time: new Date(logEntry.date).toTimeString().split(" ")[0],
        meta:
          meta.length > 0
            ? meta.map((item) => {
                return {
                  key: item,
                  value: JSON.stringify(logEntry.meta[item]),
                };
              })
            : [],
      };
    });
  if (level != "all") {
    logs = logs.filter((item: any) => item.level.toLowerCase() == level);
  }
  return logs;
};

export const readLogs = (
  option: Period = "week",
  level: Level = "all"
): Promise<any[]> => {
  return new Promise((resolve, _reject) => {
    let dates: string[] = [];

    if (option === "week") {
      dates = getDatesArray(7);
    } else if (option === "month") {
      dates = getDatesArray(30);
    } else if (option === "all") {
      const logDir = path.join(getAppRootDir(), "logs");
      dates = fs
        .readdirSync(logDir)
        .filter((file: any) => file.endsWith(".log"))
        .map((file: any) => file.replace(".log", ""));
    }

    const logsData = dates
      .map((date: string) => {
        const logs = readLogsFromDate(date, level);
        return { date, logs };
      })
      .filter((entry) => entry.logs.length > 0);

    resolve(logsData);
  });
};
