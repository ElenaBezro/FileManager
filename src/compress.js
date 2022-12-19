import { createBrotliCompress, createBrotliDecompress } from "node:zlib";
import { createWriteStream, createReadStream } from "node:fs";
import { pipeline } from "node:stream";
import { resolve, normalize, sep, parse } from "node:path";
import { stat } from "node:fs/promises";

const operationFailedMessage = "Operation Failed";

const isPathAbsolute = (path) => {
  return resolve(path) === normalize(path).replace(/[\/|\\]$/, "");
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

const compressFile = async (args, currentDir) => {
  try {
    const argsArray = getArgsArray(args);
    const sourceFilePath = isPathAbsolute(argsArray[0]) ? argsArray[0] : currentDir + sep + argsArray[0];
    const folderPath = isPathAbsolute(argsArray[1]) ? argsArray[1] : currentDir + sep + argsArray[1];
    const fileName = parse(sourceFilePath).base;
    const destinationFolderPath = folderPath + sep + fileName + ".br";

    if (!(await stat(folderPath)).isDirectory()) {
      throw new Error("Destination should be a folder");
    }
    const gzip = createBrotliCompress();
    const readStream = createReadStream(sourceFilePath);
    const writeStream = createWriteStream(destinationFolderPath);

    return new Promise((resolve) => {
      pipeline(readStream, gzip, writeStream, (err) => {
        if (err) throw new Error();
        resolve();
      });
    });
  } catch (e) {
    console.log(operationFailedMessage);
    console.log(e.message);
  }
};

const decompressFile = async (args, currentDir) => {
  try {
    const argsArray = getArgsArray(args);
    const sourceFilePath = isPathAbsolute(argsArray[0]) ? argsArray[0] : currentDir + sep + argsArray[0];
    const folderPath = isPathAbsolute(argsArray[1]) ? argsArray[1] : currentDir + sep + argsArray[1];
    const fileName = parse(sourceFilePath).base;
    const destinationFolderPath = folderPath + sep + fileName.slice(0, -3);

    if (!(await stat(folderPath)).isDirectory()) {
      throw new Error("Destination should be a folder");
    }
    const gzip = createBrotliDecompress();
    const readStream = createReadStream(sourceFilePath);
    const writeStream = createWriteStream(destinationFolderPath);

    return new Promise((resolve) => {
      pipeline(readStream, gzip, writeStream, (err) => {
        if (err) throw new Error();
        resolve();
      });
    });
  } catch (e) {
    console.log(operationFailedMessage);
    console.log(e.message);
  }
};

export { compressFile, decompressFile };
