import { getUserName } from "./getUserName.js";
import { createReadline } from "./createReadline.js";

const userName = getUserName();
const greetingMessage = `Welcome to the File Manager, ${userName}!`;

const showGreetings = () => {
  if (userName) {
    console.log(greetingMessage);
  }
};

showGreetings();
createReadline();
