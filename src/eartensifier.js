require('events').defaultMaxListeners = 30;
const EarTensifier = require('./structures/Client');
const client = new EarTensifier();

process.on('uncaughtException', (e) => {
    client.logger.error(e);
});

process.on('unhandledRejection', (e) => {
    client.logger.error(e);
});


client.login(process.env.DISCORD_TOKEN);