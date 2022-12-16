import process from "process";
import { basename, parse, sep } from "path";
import readlinePromises from "node:readline/promises";
import { access, readdir, stat } from "node:fs/promises";
import { getCurrentDir, isPathAbsolute, getElemPath } from "./pathUtils.js";
import { getUserName } from "./getUserName.js";

const invalidInputMessage = "Invalid input";
const operationFailedMessage = "Operation Failed";
const correctPathMessage = 'Absolute path should start with "". \nRelative path should start with folder name';
const userName = getUserName();
let currentDir = getCurrentDir();
const goodbyeMessage = `Thank you for using File Manager, ${userName}, goodbye!`;

const printCurrentDir = () => {
  const currentDirMessage = `You are currently in ${currentDir}` + "\n" + "Print commands and wait for results.";
  console.log(currentDirMessage);
};

const exitProgram = () => {
  console.log("\n");
  console.log(goodbyeMessage);
  rl.close();
};

const goToUpperDir = () => {
  try {
    if (currentDir !== parse(currentDir).root) {
      const currentFolderName = basename(currentDir);
      // TODO: check if path contain FILEname
      currentDir = currentDir.slice(0, currentDir.length - currentFolderName.length - 1);
    }
  } catch {
    console.log(operationFailedMessage);
  }
};

const goToDir = async (args) => {
  try {
    const newPath = isPathAbsolute(args) ? args.slice(1) : currentDir + sep + args;
    console.log(newPath);

    await access(newPath);
    currentDir = newPath;
    // TODO: Check if path contain filename
  } catch {
    console.log(operationFailedMessage);
    console.log(correctPathMessage);
  }
};

const sortFolderContent = async (array) => {
  try {
    const foldersIndex = 0;
    const filesIndex = 1;

    const sortByName = (array) => {
      const compare = (a, b) => a.localeCompare(b);
      return array.sort(compare);
    };

    const sortByType = await sortByName(array).reduce(async (acc, elem) => {
      console.log(getElemPath(elem, currentDir));
      console.log("before stat", elem);

      const elemStat = await stat(getElemPath(elem, currentDir));
      const arr = await acc;
      elemStat.isDirectory() ? arr[foldersIndex].push({ name: elem, type: "directory" }) : arr[filesIndex].push({ name: elem, type: "file" });
      return arr;
    }, Promise.resolve([[], []]));

    return sortByType[foldersIndex].concat(sortByType[filesIndex]);
  } catch (e) {
    console.log("kfjdljf");
    throw new Error(e.message);
  }
};

const showFolderContent = async () => {
  try {
    const folderContent = await readdir(currentDir);
    const sortedFolderContent = await sortFolderContent(folderContent);

    console.table(sortedFolderContent);
  } catch (e) {
    console.log(operationFailedMessage);
    console.log(e.message);
  }
};

const createReadline = () => {
  printCurrentDir();

  const rl = readlinePromises.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.on("line", async (line) => {
    const commandsWithoutArgs = ["up", ".exit", "ls"];

    if (commandsWithoutArgs.includes(line)) {
      switch (line) {
        case ".exit":
          exitProgram();
          break;
        case "up":
          goToUpperDir();
          break;
        case "ls":
          showFolderContent();
          break;
        default:
          console.log(invalidInputMessage);
      }
    } else {
      const startArgsIndex = line.indexOf(" ");
      const args = startArgsIndex !== -1 && line.slice(startArgsIndex).trim();
      console.log(args);
      const lineWithoutArgs = line.slice(0, startArgsIndex);
      console.log(lineWithoutArgs);
      switch (lineWithoutArgs) {
        case "cd":
          await goToDir(args);
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
