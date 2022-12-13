import { homedir } from "node:os";
import { dirname } from "path";
import { fileURLToPath } from "url";

const getCurrentDir = () => {
  const currentDir = "";
  const __filename = fileURLToPath(import.meta.url);
  return currentDir ? dirname(__filename) : homedir();
};

export { getCurrentDir };
