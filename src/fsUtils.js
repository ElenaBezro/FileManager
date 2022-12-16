import { stdout } from "process";
import { sep, parse } from "path";
import { stat, writeFile, rename } from "node:fs/promises";
import { createReadStream, createWriteStream } from "fs";

const operationFailedMessage = "Operation Failed";

const printFileContent = async (fileName, currentDir) => {
  try {
    const filepath = currentDir + sep + fileName;
    if ((await stat(filepath)).isFile()) {
      const readFileStream = createReadStream(filepath);
      readFileStream.pipe(stdout);
    }
  } catch (e) {
    console.log(operationFailedMessage);
    console.log(e.message);
  }
};

const addFile = async (fileName, currentDir) => {
  const filePath = currentDir + sep + fileName;
  try {
    await writeFile(filePath, "", { flag: "wx" });
  } catch (e) {
    console.log(operationFailedMessage);
    console.log(e.message);
  }
};

const renameFile = async (args, currentDir) => {
  const argsArray = args.split(" ");

  try {
    const previousName = currentDir + sep + argsArray[0];
    const newName = currentDir + sep + argsArray[1];
    await rename(previousName, newName);
  } catch (e) {
    console.log(operationFailedMessage);
    console.log(e.message);
  }
};

const copyFile = async (args, currentDir) => {
  const argsArray = args.split(" ");
  try {
    const originFilePath = argsArray[0];
    const folderToCopyInPath = argsArray[1];
    const fileName = parse(originFilePath).base;

    await addFile(fileName, folderToCopyInPath);

    if ((await stat(originFilePath)).isFile() && (await stat(folderToCopyInPath)).isDirectory()) {
      const readFileStream = createReadStream(originFilePath);
      const writeFileStream = createWriteStream(folderToCopyInPath + sep + fileName);
      readFileStream.pipe(writeFileStream);
    } else {
      console.log("Path should be absolute. \n Example: 'cp c:\\Users\\111.txt d:\\Downloads'");
      throw new Error();
    }
  } catch (e) {
    console.log(operationFailedMessage);
    console.log(e.message);
  }
};

export { printFileContent, addFile, renameFile, copyFile };
