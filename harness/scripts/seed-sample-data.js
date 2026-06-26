const fs = require("fs");
const path = require("path");

const fixtureName = process.argv[2] || "sample-month";
const outputPath = process.argv[3] || path.join(process.cwd(), "tmp-data.json");

const fixturePath = path.join(__dirname, "..", "fixtures", `${fixtureName}.json`);

if (!fs.existsSync(fixturePath)) {
  console.error(`Unknown fixture: ${fixtureName}`);
  process.exit(1);
}

fs.copyFileSync(fixturePath, outputPath);
console.log(`Seeded ${fixtureName} to ${path.resolve(outputPath)}`);
