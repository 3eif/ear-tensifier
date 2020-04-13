const DBL = require('dblapi.js');
const { post } = require('../../tokens.json');

module.exports = async (client) => {
	const dbl = new DBL(post['topGG']['token'], {
		webhookPort: post['topGG']['port'],
		webhookAuth: post['topGG']['password'],
	}, client);

	dbl.getVotes().then(votes => {
		return votes;
	});
};
