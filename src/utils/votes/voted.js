const DBL = require('dblapi.js');

const { post } = require('../../tokens.json');

module.exports = async (client, user) => {
	// client.dbl = new DBL(post['topGG']['token'], {
	// 	webhookPort: post['topGG']['port'],
	// 	webhookAuth: post['topGG']['password'],
	// }, client);

	// client.dbl.hasVoted(user.id).then(voted => {
	// 	if (voted) { return true; }
	// 	else { return false; }
	// });
	client.dbl.webhook.on('ready', async (hook) => {
		client.log(`Top.gg webhook running at http://${hook.hostname}:${hook.port}${hook.path}`);
	});
};