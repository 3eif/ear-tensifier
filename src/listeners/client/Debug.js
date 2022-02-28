var { createWriteStream, existsSync, mkdirSync, writeFileSync } = require("fs");
var { format } = require("util");
var debugLog = createWriteStream("./src/logs/debug.log", { flags: "a" });
var log_stdout = process.stdout;
const Event = require('../../structures/Event');

class Debug extends Event {
  constructor(...args) {
    super(...args);
  }

  async run(log) {
    console.log(log);
    if (!existsSync("./src/logs")) mkdirSync("./src/logs");
    if (!existsSync("./src/logs/debug.log"))
      writeFileSync("./src/logs/debug.log", "");
    debugLog.write(`${format(log)}\n`);
    log_stdout.write(`${format(log)}\n`);
  }
}
module.exports = Debug;
