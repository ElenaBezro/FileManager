import { EOL, cpus, homedir, userInfo, arch } from "node:os";

const invalidInputMessage = "Invalid input";

const printCPUsInfo = () => {
  const cpusInfo = cpus();
  const cpuAmount = cpusInfo.length;

  const cpusModelAndSpeed = cpusInfo.reduce((acc, { model, speed }) => {
    acc.push({ model, clockRateGHz: speed / 1000 });
    return acc;
  }, []);
  console.log(`CPU amount: ${cpuAmount}`);
  console.table(cpusModelAndSpeed);
};

const printUserName = () => {
  try {
    console.log(userInfo().username);
  } catch {
    console.log("User has no username or homedir");
  }
};

const getOSInfo = (args) => {
  switch (args) {
    case "--EOL":
      console.log(JSON.stringify(EOL));
      break;
    case "--cpus":
      printCPUsInfo();
      break;
    case "--homedir":
      console.log(`Home directory: ${homedir()}`);
      break;
    case "--username":
      printUserName();
      break;
    case "--architecture":
      console.log(arch());
      break;
    default:
      console.log(invalidInputMessage);
  }
};

export { getOSInfo };
