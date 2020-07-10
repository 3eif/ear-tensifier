const Command = require('../../structures/Command');

const playlists = require('../../models/playlist.js');
const spawnPlayer = require('../../player/spawnPlayer.js');
const Discord = require('discord.js');

module.exports = class Load extends Command {
	constructor(client) {
		super(client, {
			name: 'load',
			description: 'Loads a playlist into your queue.',
			inVoiceChannel: true,
			args: true,
			usage: '<playlist name>',
			permission: 'pro',
			botPermissions: ['CONNECT', 'SPEAK'],
		});
	}
	async run(client, message, args) {
		let player = client.music.players.get(message.guild.id);
		if (player && player.playing === false && player.current) return message.channel.send(`Cannot play/queue songs while paused. Do \`${client.settings.prefix} resume\` to play.`);
		if (!player) player = await spawnPlayer(client, message);

		const msg = await message.channel.send(`${client.emojiList.cd} Loading playlist (This might take a few seconds)...`);

		const songLimit = await client.songLimit(message.author.id, player.queue.length);
		if(songLimit) return msg.edit(`You have reached the **maximum** amount of songs (${songLimit} songs). Want more songs? Consider donating here: https://www.patreon.com/eartensifier`);

		const playlistName = args.join(' ').replace(/_/g, ' ');

		playlists.findOne({
			name: playlistName,
			creator: message.author.id,
		}, async (err, p) => {
			if (err) client.log(err);
			if(!p) {
				const embed = new Discord.MessageEmbed()
				.setAuthor(playlistName, message.author.displayAvatarURL())
				.setDescription(`${client.emojiList.no} Couldn't find a playlist by the name ${playlistName}.`)
				.setTimestamp()
				.setColor(client.colors.main);
				return msg.edit('', embed);
			}

			let songsToAdd = p.songs.length;
			const sL = await client.getSongLimit(message.author.id);
			if (player.queue.length == 0) { songsToAdd = Math.min(sL, p.songs.length); }
			else {
				const totalSongs = player.queue.length + p.songs.length;
				if (totalSongs > sL) songsToAdd = Math.min(sL - player.queue.length, p.songs.length);
				else songsToAdd = p.songs.length;
			}

			// eslint-disable-next-line no-async-promise-executor
			const content = new Promise(async function(resolve) {
				for (let i = 0; i < songsToAdd; i++) {
					player.queue.add(p.songs[i]);
					if (!player.playing && !player.paused && !player.queue.length) player.play();
					if (i == songsToAdd - 1) resolve();
				}
			});

			content.then(async function() {
				const embed = new Discord.MessageEmbed()
				.setDescription(`Queued **${songsToAdd} songs** from **${playlistName}**.`)
				.setColor(client.colors.main);
				msg.edit('', embed);
			});
		});
	}
};