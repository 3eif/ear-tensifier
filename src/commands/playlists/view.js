/* eslint-disable no-unused-vars */
const Command = require('../../structures/Command');

const Discord = require('discord.js');
const playlists = require('../../models/playlist.js');
const paginate = require('../../utils/music/paginate.js');

module.exports = class View extends Command {
	constructor(client) {
		super(client, {
			name: 'view',
			description: 'View the songs in a certain playlist.',
			cooldown: 5,
			args: true,
			usage: '<playlist name>',
			permission: 'pro',
		});
	}
	async run(client, message, args) {
		const playlistName = args.join(' ').replace(/_/g, ' ');

		playlists.findOne({
			name: playlistName,
			creator: message.author.id,
		}, async (err, p) => {
			if (err) client.log(err);

			if (!p) {
				const embed = new Discord.MessageEmbed()
					.setAuthor(playlistName, message.author.displayAvatarURL())
					.setDescription(`${client.emojiList.no} Couldn't find a playlist by the name ${playlistName}.\nFor a list of your playlists type \`ear playlists\``)
					.setTimestamp()
					.setColor(client.colors.main);
				return message.channel.send(embed);
			}

			let pagesNum = Math.ceil(p.songs.length / 10);
			if (pagesNum === 0) pagesNum = 1;

			let totalQueueDuration = 0;
			for(let i = 0; i < p.songs.length; i++) {
				totalQueueDuration += p.songs[i].duration;
			}

			const pages = [];
			let n = 1;
			for (let i = 0; i < pagesNum; i++) {
				const str = `${p.songs.slice(i * 10, i * 10 + 10).map(song => `**${n++}.** [${song.title}](https://www.youtube.com/watch?v=${song.identifier}) \`[${client.formatDuration(song.duration)}]\``).join('\n')}`;
				const embed = new Discord.MessageEmbed()
					.setAuthor(message.author.tag, message.author.displayAvatarURL())
					.setThumbnail(message.author.displayAvatarURL())
					.setTitle(p.name)
					.setDescription(str)
					.setColor(client.colors.main)
					.setFooter(`ID: ${p._id}`)
					.setTimestamp()
					.setFooter(`Page ${i + 1}/${pagesNum} | ${p.songs.length} songs | ${client.formatDuration(totalQueueDuration)} total duration`);
				pages.push(embed);
				if (i == pagesNum - 1 && pagesNum > 1) paginate(client, message, pages, ['◀️', '▶️'], 120000, p.songs.length, client.formatDuration(totalQueueDuration));
				else if(pagesNum == 1) message.channel.send(embed);
			}
		});
	}
};