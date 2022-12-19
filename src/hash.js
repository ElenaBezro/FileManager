import { createHash } from "node:crypto";
import { createReadStream } from "node:fs";
import { sep, resolve, normalize } from "node:path";
import { stat } from "node:fs/promises";

const operationFailedMessage = "Operation Failed";

const isPathAbsolute = (path) => {
  return resolve(path).replace(/[\/|\\]$/, "") === normalize(path).replace(/[\/|\\]$/, "");
};

const printHash = async (args, currentDir) => {
  try {
    const filePath = isPathAbsolute(args) ? args : currentDir + sep + args;
    if ((await stat(filePath)).isFile()) {
      const readFileStream = createReadStream(filePath);
      return new Promise((resolve) => {
        readFileStream.on("end", () => {
          const hash = createHash("sha256");
          console.log(hash.digest("hex"));
          resolve();
        });

        readFileStream.resume();
      });
    } else throw new Error();
  } catch (e) {
    console.log(operationFailedMessage);
    console.log(e.message);
  }
};

export { printHash };
