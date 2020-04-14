module.exports = async (client, user) => {
	client.dbl.hasVoted(user.id).then(voted => {
		return voted;
	});
};