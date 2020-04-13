const DBL = require('dblapi.js');
const { post } = require('../../tokens.json');

module.exports = async (client, user) => {
	const dbl = new DBL(post['topGG']['token'], {
		webhookPort: post['topGG']['port'],
		webhookAuth: post['topGG']['password'],
	}, client);

	dbl.hasVoted(user.id).then(voted => {
		if (voted) { return true; }
		else { return false; }
	});
};