const users = require('../../models/user.js');

module.exports = {
	name: 'delete',
	description: 'Deletes a song from your favorites.',
	args: true,
	usage: '<song position> or all',
	async execute(client, message, args) {
		const msg = await message.channel.send(`${client.emojiList.loading} Deleting song(s)...`);

		users.findOne({
			authorID: message.author.id,
		}, async (err, u) => {
			if (err) client.log(err);

			if(!u.favorites || u.favorites.length == 0 || !u.favorites.length) return msg.edit('You have no favorites. To add favorites type `ear add <search query/link>`');
			if(args[0].toLowerCase() == 'all') {
				u.favorites = [];
				msg.edit('Removed all songs from favorites.');
			}
			else if(!isNaN(args[0])) {
				if(u.favorites.length < args[0]) return msg.edit(`Song #${args[0]} does not exist. Type \`ear favorites\` to view your songs.`);
				msg.edit('Removed song from favorites.');
				u.favorites.splice(args[0] - 1, 1);
			}
			else {
				return msg.edit('Invalid number.\nTo delete a specific song from your favorites: `ear delete <song number>`.\nTo delete all songs from your favorites: `ear delete all`');
			}

			await u.save().catch(e => client.log(e));
		});
	},
};