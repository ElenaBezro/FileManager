import process from "process";
import readlinePromises from "node:readline/promises";
import { getCurrentDir, goToDir, goToUpperDir, showFolderContent } from "./pathUtils.js";
import { getUserName } from "./getUserName.js";
import { printFileContent, addFile, renameFile, copyFile } from "./fsUtils.js";

const invalidInputMessage = "Invalid input";
const userName = getUserName();
let currentDir = getCurrentDir();
const goodbyeMessage = `Thank you for using File Manager, ${userName}, goodbye!`;

const printCurrentDir = () => {
  const currentDirMessage = `You are currently in ${currentDir}` + "\n" + "Print commands and wait for results.";
  console.log(currentDirMessage);
};

const createReadline = () => {
  printCurrentDir();

  const rl = readlinePromises.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const exitProgram = () => {
    console.log("\n");
    console.log(goodbyeMessage);
    rl.close();
  };

  rl.on("line", async (line) => {
    const commandsWithoutArgs = ["up", ".exit", "ls"];

    if (commandsWithoutArgs.includes(line)) {
      switch (line) {
        case ".exit":
          exitProgram();
          break;
        case "up":
          currentDir = goToUpperDir(currentDir);
          break;
        case "ls":
          await showFolderContent(currentDir);
          break;
        default:
          console.log(invalidInputMessage);
      }
    } else {
      const startArgsIndex = line.indexOf(" ");
      const args = startArgsIndex !== -1 && line.slice(startArgsIndex).trim();
      const lineWithoutArgs = line.slice(0, startArgsIndex);
      switch (lineWithoutArgs) {
        case "cd":
          currentDir = await goToDir(args, currentDir);
          break;
        case "cat":
          await printFileContent(args, currentDir);
          break;
        case "add":
          await addFile(args, currentDir);
          break;
        case "rn":
          await renameFile(args, currentDir);
          break;
        case "cp":
          await copyFile(args, currentDir);
          break;
        default:
          console.log(invalidInputMessage);
      }
    }
    printCurrentDir();
  });

  rl.on("SIGINT", () => {
    exitProgram();
  });
};

export { createReadline };
