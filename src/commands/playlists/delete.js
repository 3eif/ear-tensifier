const Command = require('../../structures/Command');

const playlists = require('../../models/playlist.js');
const Discord = require('discord.js');

module.exports = class Delete extends Command {
	constructor(client) {
		super(client, {
			name: 'delete',
			description: 'Deletes a playlist.',
			args: false,
			permission: 'pro',
		});
	}
	async run(client, message, args) {
		const msg = await message.channel.send(`${client.emojiList.loading} Deleting song(s) from your playlist...`);

		const playlistName = args.join(' ').replace(/_/g, ' ');

		playlists.findOneAndDelete({
			name: playlistName,
			creator: message.author.id,
		})
		.then(deletedDocument => {
			if(deletedDocument) {
				const embed = new Discord.MessageEmbed()
				.setAuthor(playlistName, message.author.displayAvatarURL())
				.setDescription(`${client.emojiList.yes} Deleted playlist: \`${playlistName}\``)
				.setTimestamp()
				.setColor(client.colors.main);
				return msg.edit('', embed);
			}
			else {
				const embed = new Discord.MessageEmbed()
				.setAuthor(playlistName, message.author.displayAvatarURL())
				.setDescription(`${client.emojiList.no} Couldn't find a playlist by the name ${playlistName}.\nFor a list of your playlists type \`ear playlists\``)
				.setTimestamp()
				.setColor(client.colors.main);
				return msg.edit('', embed);
			}
		})
		.catch(err => msg.edit(`${client.emojiList.no} Failed to find and delete document: ${err}`));
	}
};