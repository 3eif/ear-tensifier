const { Source } = require('yasha');
require('events').defaultMaxListeners = 30;
const EarTensifier = require('./structures/Client');
const client = new EarTensifier();

process.on('uncaughtException', (e) => {
    client.logger.error(e);
});

process.on('unhandledRejection', (e) => {
    client.logger.error(e);
});

Source.Youtube.setCookie(process.env.YOUTUBE_COOKIE);
client.login(process.env.DISCORD_TOKEN);