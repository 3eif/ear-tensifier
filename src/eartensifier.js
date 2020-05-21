const Sentry = require('@sentry/node');

const EarTensifier = require('./structures/Client');
const client = new EarTensifier(process.env.DISCORD_TOKEN);
client.login();

Sentry.init({
	dsn: process.env.SENTRY_URL,
	environment: process.env.SENTRY_ENVIRONMENT,
});

['commands', 'events'].forEach(handler => require(`./handlers/${handler}`)(client));