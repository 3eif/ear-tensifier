require('events').defaultMaxListeners = 20;
const EarTensifier = require('./structures/Client');
const client = new EarTensifier();
client.login(process.env.DISCORD_TOKEN);