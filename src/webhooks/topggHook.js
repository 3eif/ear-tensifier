const DBL = require('dblapi.js');
const voteRewards = require('../utils/voting/voteRewards.js');

module.exports.startUp = async (client) => {
	const dblWebhook = new DBL(process.env.TOPGG_TOKEN, {
		webhookPort: process.env.TOPGG_PORT,
		webhookAuth: process.env.TOPGG_PASSWORD,
	}, client);

	dblWebhook.webhook.on('ready', async (hook) => {
		client.log(`Top.gg webhook running at http://${hook.hostname}:${hook.port}${hook.path}`);
	});

	dblWebhook.webhook.on('vote', async (voter) => {
		const user = await client.users.fetch(voter.user);
        voteRewards(client, user);
	});
};