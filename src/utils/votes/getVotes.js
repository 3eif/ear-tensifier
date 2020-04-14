const DBL = require('dblapi.js');
const { post } = require('../../tokens.json');

module.exports = async (client) => {
	client.dbl.getVotes().then(votes => {
		return votes;
	});
};
