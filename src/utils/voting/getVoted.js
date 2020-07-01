const users = require('../../models/user.js');

module.exports = async (client, author) => {
	const u = await users.findOne({ authorID: author.id });
	if (!u) return false;
	if(!u.lastVoted) u.lastVoted = Date.now();
	if (u.lastVoted < Date.now() - client.settings.voteCooldown) {
		u.voted = false;
		await u.save().catch(e => console.log(e));
		return false;
	}
	else {
		u.voted = true;
		await u.save().catch(e => console.log(e));
		return true;
	}
};