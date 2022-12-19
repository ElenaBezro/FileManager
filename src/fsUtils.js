import { stdout } from "process";
import { sep, parse, normalize, resolve } from "path";
import { stat, writeFile, rename, unlink } from "node:fs/promises";
import { createReadStream, createWriteStream } from "fs";

const operationFailedMessage = "Operation Failed";

const isPathAbsolute = (path) => {
  return resolve(path).replace(/[\/|\\]$/, "") === normalize(path).replace(/[\/|\\]$/, "");
};

const getArgsArray = (args) => {
  const regex = new RegExp('"[^"]+"|[\\S]+', "g");
  const argsArray = [];
  args
    .replaceAll("'", '"')
    .match(regex)
    .forEach((element) => {
      if (!element) return;
      return argsArray.push(element.replace(/"/g, ""));
    });
  return argsArray;
};

const printFileContent = async (fileName, currentDir) => {
  try {
    const filepath = isPathAbsolute(fileName) ? fileName : currentDir + sep + fileName;
    if ((await stat(filepath)).isFile()) {
      return new Promise((resolve) => {
        const readFileStream = createReadStream(filepath);
        readFileStream.pipe(stdout);
        readFileStream.on("end", () => {
          console.log("\n");
          resolve();
        });
      });
    }
  } catch (e) {
    console.log(operationFailedMessage);
    console.log(e.message);
  }
};

const addFile = async (fileName, currentDir) => {
  // TODO: add case with space in file name.
  const filePath = currentDir + sep + fileName;
  try {
    await writeFile(filePath, "", { flag: "wx" });
  } catch (e) {
    console.log(operationFailedMessage);
    console.log(e.message);
  }
};

const renameFile = async (args, currentDir) => {
  const argsArray = getArgsArray(args);

  try {
    const previousName = isPathAbsolute(argsArray[0]) ? argsArray[0] : currentDir + sep + argsArray[0];
    const newName = isPathAbsolute(argsArray[1]) ? argsArray[1] : currentDir + sep + argsArray[1];

    await rename(previousName, newName);
  } catch (e) {
    console.log(operationFailedMessage);
    console.log(e.message);
  }
};

const copyFile = async (args, currentDir, removeSourceFile = false) => {
  const argsArray = getArgsArray(args);

  try {
    const originFilePath = isPathAbsolute(argsArray[0]) ? argsArray[0] : currentDir + sep + argsArray[0];
    const folderToCopyInPath = isPathAbsolute(argsArray[1]) ? argsArray[1] : currentDir + sep + argsArray[1];
    const fileName = parse(originFilePath).base;

    await addFile(fileName, folderToCopyInPath);

    const originFileStat = await stat(originFilePath);
    const folderToCopyInStat = await stat(folderToCopyInPath);
    if (originFileStat.isFile() && folderToCopyInStat.isDirectory()) {
      const readFileStream = createReadStream(originFilePath);
      const writeFileStream = createWriteStream(folderToCopyInPath + sep + fileName);
      readFileStream.pipe(writeFileStream);
      if (removeSourceFile) {
        readFileStream.on("end", () => {
          unlink(originFilePath);
        });
      }
    } else {
      console.log("Path should be absolute. \n Example: 'cp c:\\Users\\111.txt d:\\Downloads'");
      throw new Error();
    }
  } catch (e) {
    console.log(operationFailedMessage);
    console.log(e.message);
  }
};

const moveFile = async (args, currentDir) => {
  try {
    await copyFile(args, currentDir, true);
  } catch (e) {
    console.log(operationFailedMessage);
    console.log(e.message);
  }
};

const removeFile = async (args, currentDir) => {
  const argsArray = getArgsArray(args);

  try {
    const filePath = isPathAbsolute(argsArray[0]) ? argsArray[0] : currentDir + sep + argsArray[0];
    if ((await stat(filePath)).isFile()) {
      unlink(filePath);
    }
  } catch (e) {
    console.log(operationFailedMessage);
    console.log(e.message);
  }
};

export { printFileContent, addFile, renameFile, copyFile, moveFile, removeFile };
