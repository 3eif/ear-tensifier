const users = require('../../models/user.js');

module.exports = async (user, pledge) => {
	switch (pledge) {
		case 'Premium': {
			const u = await users.findOne({ authorID: user });
			if(u.moderator) return u.moderator;
			return u.premium;
		}
		case 'Pro': {
			const u = await users.findOne({ authorID: user });
			if(u.moderator) return u.moderator;
			return u.pro;
		}
	}
};