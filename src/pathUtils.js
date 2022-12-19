import { homedir } from "node:os";
import { fileURLToPath } from "url";
import { dirname, basename, parse, sep, format, normalize, resolve } from "path";
import { readdir, stat } from "node:fs/promises";

const operationFailedMessage = "Operation Failed";

const getCurrentDir = () => {
  const currentDir = "";
  const __filename = fileURLToPath(import.meta.url);
  return currentDir ? dirname(__filename) : homedir();
};

// const isPathAbsolute = (args) => {
//   return args.startsWith("\\");
// };

const isPathAbsolute = (path) => {
  return resolve(path).replace(/[\/|\\]$/, "") === normalize(path).replace(/[\/|\\]$/, "");
};

const getElemPath = (elem, currentDir) => {
  return currentDir + sep + elem;
};

const goToUpperDir = (currentDir) => {
  try {
    if (currentDir !== parse(currentDir).root) {
      const currentFolderName = basename(currentDir);
      // TODO: check if path contain FILEname
      return currentDir.slice(0, currentDir.length - currentFolderName.length - 1);
    }

    return currentDir;
  } catch {
    console.log(operationFailedMessage);
    return currentDir;
  }
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

const goToDir = async (args, currentDir) => {
  try {
    const argsArray = getArgsArray(args);
    const newPath = isPathAbsolute(argsArray[0]) ? argsArray[0] : currentDir + sep + argsArray[0];

    if ((await stat(newPath)).isDirectory()) {
      return format(parse(newPath));
    } else {
      throw new Error(`${newPath} is not a directory`);
    }
  } catch (e) {
    console.log(operationFailedMessage);
    console.log(e.message);
    return currentDir;
  }
};

const sortFolderContent = async (array, currentDir) => {
  try {
    const fileNameComparator = (a, b) => a.localeCompare(b);
    const sortByName = (array) => array.sort(fileNameComparator);

    const folders = [];
    const files = [];

    const sortedFileAndDirectoryNames = await sortByName(array);
    for (const fileOrDirectoryName of sortedFileAndDirectoryNames) {
      const fileOrDirectoryStat = await stat(getElemPath(fileOrDirectoryName, currentDir));
      if (fileOrDirectoryStat.isDirectory()) {
        folders.push({ name: fileOrDirectoryName, type: "directory" });
      } else {
        files.push({ name: fileOrDirectoryName, type: "file" });
      }
    }

    return [...folders, ...files];
  } catch (e) {
    throw new Error(e.message);
  }
};

const showFolderContent = async (currentDir) => {
  try {
    const folderContent = await readdir(currentDir);
    const sortedFolderContent = await sortFolderContent(folderContent, currentDir);

    console.table(sortedFolderContent);
  } catch (e) {
    console.log(operationFailedMessage);
    console.log(e.message);
  }
};

export { getCurrentDir, isPathAbsolute, getElemPath, goToDir, goToUpperDir, showFolderContent };
