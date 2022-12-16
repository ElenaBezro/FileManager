import { stdout } from "process";
import { sep } from "path";
import { stat, writeFile } from "node:fs/promises";
import { createReadStream } from "fs";

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

export { printFileContent, addFile };
