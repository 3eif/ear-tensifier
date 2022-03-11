const { createWriteStream, existsSync, mkdirSync, writeFileSync } = require('fs');
const { format } = require('util');
const file = createWriteStream('./src/logs/debug.log', { flags: 'a' }); // 'flags: a' basically allows the file to automatically append to the next line.
const printf = process.stdout;
const Event = require('../../structures/Event');

Date.prototype.today = function() {
    return ((this.getDate() < 10) ? '0' : '') + this.getDate() + '/' + (((this.getMonth() + 1) < 10) ? '0' : '') + (this.getMonth() + 1) + '/' + this.getFullYear();
};

Date.prototype.timeNow = function() {
     return ((this.getHours() < 10) ? '0' : '') + this.getHours() + ':' + ((this.getMinutes() < 10) ? '0' : '') + this.getMinutes() + ':' + ((this.getSeconds() < 10) ? '0' : '') + this.getSeconds();
};

class Debug extends Event {
  constructor(...args) {
    super(...args);
  }

  async run(log) {
    if (!existsSync('./src/logs')) mkdirSync('./src/logs');
    if (!existsSync('./src/logs/debug.log'))
      writeFileSync('./src/logs/debug.log', '');
    const date = new Date().today() + ' @ ' + new Date().timeNow(); // added for aesthetics of timestamp & date finding when debugging.
    file.write(`[${date}] ${format(log)}\n`); // Writes to ./src/logs/debug.log file (also automatically appends).
    printf.write(`[${date}] ${format(log)}\n`); // Writes to Console.
  }
}
module.exports = Debug;
