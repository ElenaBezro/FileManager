import process from "process";
import readlinePromises from "node:readline/promises";
import { getCurrentDir } from "./getDirectory.js";
import { getUserName } from "./getUserName.js";

const invalidInputMessage = "Invalid input";
const userName = getUserName();
const goodbyeMessage = `Thank you for using File Manager, ${userName}, goodbye!`;
const currentDirMessage = `You are currently in ${getCurrentDir()}.` + "\n" + "Print commands and wait for results.";

const printCurrentDir = () => {
  console.log(currentDirMessage);
};

const exitProgram = () => {
  console.log("\n");
  console.log(goodbyeMessage);
  rl.close();
};

const createReadline = () => {
  printCurrentDir();

  const rl = readlinePromises.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.on("line", (line) => {
    printCurrentDir();
    if (line === ".exit") {
      exitProgram();
    }
  });

  rl.on("SIGINT", () => {
    exitProgram();
  });
};

export { createReadline };
