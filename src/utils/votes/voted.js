module.exports = async (client, user) => {
	client.dbl.hasVoted(user.id).then(voted => {
		console.log(voted);
		if (voted) { return true; }
		else { return false; }
	});
};