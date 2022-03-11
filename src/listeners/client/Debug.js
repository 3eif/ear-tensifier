const { createWriteStream, existsSync, mkdirSync, writeFileSync } = require('fs');
const { format } = require('util');
const file = createWriteStream('./src/logs/debug.log', { flags: 'a' });
const Event = require('../../structures/Event');

class Debug extends Event {
  constructor(...args) {
    super(...args);
  }

  async run(log) {
    const date = new Date();
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const time = date.getHours() + ':' + ('0' + date.getMinutes()).slice(-2) + ':' + ('0' + date.getSeconds()).slice(-2);

    if (!existsSync('./src/logs')) mkdirSync('./src/logs');
    if (!existsSync('./src/logs/debug.log'))
      writeFileSync('./src/logs/debug.log', '');
    const dateString = `[${month}/${day}/${year}] [${time} ${(date.getHours() >= 12) ? 'PM' : 'AM'}]`;
    file.write(`${dateString} ${format(log)}\n`);
  }
}
module.exports = Debug;
