// module.exports = async (client, user) => {
// 	return client.dbl.hasVoted(user.id);
// };

const users = require('../../models/user.js');

module.exports = async (client, author) => {
	async function getVoted() {
		users.findOne({
			authorID: author.id,
		}, async (err, u) => {
			if (err) console.log(err);
			if (!u) {
				const newUser = new users({
					authorID: author.id,
					bio: '',
					songsPlayed: 0,
					commandsUsed: 0,
					blocked: false,
					premium: false,
					pro: false,
					developer: false,
					voted: false,
				});
				await newUser.save().catch(e => console.log(e));
				return false;
			}
			else {
				if (!u.voted) { return false; }
				else if (u.voted) {
					if (client.settings.voteCooldown - (Date.now() - u.lastVoted) > 0) {
						return true;
					}
					else {
						u.voted = false;
						return false;
					}
				}
				await u.save().catch(e => console.log(e));
			}
		});
	}

	console.log(await getVoted());
};