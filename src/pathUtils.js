import { homedir } from "node:os";
import { dirname, sep } from "path";
import { fileURLToPath } from "url";

const getCurrentDir = () => {
  const currentDir = "";
  const __filename = fileURLToPath(import.meta.url);
  return currentDir ? dirname(__filename) : homedir();
};

const isPathAbsolute = (args) => {
  return args.startsWith("\\");
};

const getElemPath = (elem, currentDir) => {
  return currentDir + sep + elem;
};

export { getCurrentDir, isPathAbsolute, getElemPath };
