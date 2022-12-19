const invalidInputMessage = "Invalid input";
const checkNameInputMessage = 'Please, use this pattern: "npm run start -- --username=your_username"';

const getUserName = () => {
  try {
    if (process.argv.length > 1 && process.argv[2].startsWith("--username=")) {
      const name = process.argv[2].slice(11);
      return name;
    } else {
      throw new Error();
    }
  } catch {
    console.log(invalidInputMessage);
    console.log(checkNameInputMessage);
    throw new Error();
  }
};

export { getUserName };
