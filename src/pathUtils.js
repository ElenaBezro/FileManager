import { homedir } from "node:os";
import { fileURLToPath } from "url";
import { dirname, basename, parse, sep, format } from "path";
import { readdir, stat } from "node:fs/promises";

const operationFailedMessage = "Operation Failed";
const correctPathMessage = 'Absolute path should start with "\\". \nRelative path should start with folder name';

const getCurrentDir = () => {
  const currentDir = "";
  const __filename = fileURLToPath(import.meta.url);
  return currentDir ? dirname(__filename) : homedir();
};

const isPathAbsolute = (args) => {
  return args.startsWith("\\");
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

const goToDir = async (args, currentDir) => {
  try {
    const newPath = isPathAbsolute(args) ? args.slice(1) : currentDir + sep + args;

    if ((await stat(newPath)).isDirectory()) {
      return format(parse(newPath));
    } else {
      throw new Error(`${newPath} is not a directory`);
    }
  } catch (e) {
    console.log(operationFailedMessage);
    console.log(correctPathMessage);
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
