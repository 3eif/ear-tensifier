const Client = require('./structures/Client');
const client = new Client(process.env.DISCORD_TOKEN);
client.login();