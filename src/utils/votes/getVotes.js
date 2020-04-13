module.exports = async (client) => {
	client.dbl.getVotes().then(votes => {
		return votes;
	});
};
