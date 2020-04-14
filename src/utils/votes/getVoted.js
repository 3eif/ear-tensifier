module.exports = async (client, user) => {
	return client.dbl.hasVoted(user.id);
};