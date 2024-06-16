import path from "path";
import fs from "fs";

export const getAppRootDir: () => string = () => {
  let currentDir = __dirname;
  while (!fs.existsSync(path.join(currentDir, "package.json"))) {
    currentDir = path.join(currentDir, "..");
  }

  const packageJsonPath = path.join(currentDir, "package.json");
  const packageJsonContent = fs.readFileSync(packageJsonPath, "utf8");

  let jsonContent = JSON.parse(packageJsonContent);
  const isRoot = !!jsonContent.dependencies["logitt"];

  if (!isRoot) {
    currentDir = path.join(currentDir, "../..");
  }
  return currentDir;
};
