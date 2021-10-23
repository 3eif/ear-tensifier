const Sentry = require('@sentry/node');

const EarTensifier = require('./structures/Client');
const client = new EarTensifier(process.env.DISCORD_TOKEN);
client.login();

['commands', 'events'].forEach(handler => require(`./handlers/${handler}`)(client));