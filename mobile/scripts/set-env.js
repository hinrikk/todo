const { execSync } = require("child_process");
const fs = require("fs");

const branch = execSync("git branch --show-current")
  .toString()
  .trim();

const branchName = branch.replaceAll("/", "-");

const apiUrl = `https://${branchName}.test.magicalotter.de`;

fs.writeFileSync(
  ".env",
  `EXPO_PUBLIC_API_URL=${apiUrl}\n`
);

console.log(`API URL: ${apiUrl}`);
