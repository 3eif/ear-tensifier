module.exports = async (client, user) => {
	client.dbl.hasVoted(user.id).then(voted => {
		if (voted) { return true; }
		else { return false; }
	});
};