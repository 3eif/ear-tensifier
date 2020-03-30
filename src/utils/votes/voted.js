const DBL = require('dblapi.js');
const { post } = require('../tokens.json');
const premium = require('../premium/premium.js');

module.exports = async (client, message) => {
	if(await premium(message.author.id, 'Premium') == false) return true;

	const dbl = new DBL(post['topGG']['token'], { webhookPort: 5000, webhookAuth: post['topGG']['password'] }, client);
	dbl.hasVoted(message.author.id).then(() => {
		return true;
	});
};