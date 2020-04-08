const play = require('../../utils/play.js');
const patreon = require('../../resources/patreon.json');
const premium = require('../../utils/premium/premium.js');
const { getData, getPreview } = require('spotify-url-info');

module.exports = {
	name: 'spotify',
	description: 'Plays a spotify track.',
	usage: '<spotify link>',
	cooldown: '5',
	args: true,
	inVoiceChannel: true,
	async execute(client, message, args) {
		if (!args[0]) return message.channel.send('Please provide a search query.');

		const permissions = message.member.voice.channel.permissionsFor(client.user);
		if(!permissions.has('CONNECT')) return client.responses('noPermissionConnect', message);
		if(!permissions.has('SPEAK')) return client.responses('noPermissionSpeak', message);

		let player = client.music.players.get(message.guild.id);

		if (!player) {
			player = client.music.players.spawn({
				guild: message.guild,
				textChannel: message.channel,
				voiceChannel: message.member.voice.channel,
			});
		}

		if (player.pause == 'paused') return message.channel.send(`Cannot play/queue songs while paused. Do \`${client.settings.prefix} resume\` to play.`);

		const msg = await message.channel.send(`${client.emojiList.cd}  Searching for \`${args.join(' ')}\`...`);

		if (await songLimit() == patreon.defaultMaxSongs && player.queue.size >= patreon.defaultMaxSongs) return msg.edit(`You have reached the **maximum** amount of songs (${patreon.defaultMaxSongs} songs). Want more songs? Consider donating here: https://www.patreon.com/eartensifier`);
		if (await songLimit() == patreon.premiumMaxSongs && player.queue.size >= patreon.premiumMaxSongs) return msg.edit(`You have reached the **maximum** amount of songs (${patreon.premiumMaxSongs} songs). Want more songs? Consider donating here: https://www.patreon.com/eartensifier`);
		if (await songLimit() == patreon.proMaxSongs && player.queue.size >= patreon.proMaxSongs) return msg.edit(`You have reached the **maximum** amount of songs (${patreon.proMaxSongs} songs). Want more songs? Contact the developer: \`Tetra#0001\``);

		if (args[0].startsWith('https://open.spotify.com')) {
			const data = await getData(args.join(' '));
			if (data.type == 'playlist' || data.type == 'album') {
				const sL = await songLimit();
				let songsToAdd = 0;
				if (player.queue.length == 0) { songsToAdd = Math.min(sL, data.tracks.items.length); }
				else {
					const totalSongs = player.queue.length + data.tracks.items.length;
					if (totalSongs > sL) songsToAdd = Math.min(sL - player.queue.length, data.tracks.items.length);
					else songsToAdd = data.tracks.items.length;
				}
				if (data.type == 'playlist') {
					for (let i = 0; i < songsToAdd; i++) {
						const song = data.tracks.items[i];
						play(client, message, msg, player, `${song.track.name} ${song.track.artists[0].name}`, true);
					}
				}
				else {
					await data.tracks.items.forEach(song => {
						play(client, message, msg, player, `${song.name} ${song.artists[0].name}`, true);
					});
				}
				const playlistInfo = await getPreview(args.join(' '));
				if (data.tracks.items.length != songsToAdd) {
					if (await songLimit() == patreon.defaultMaxSongs) msg.edit(`**${playlistInfo.title}** (${songsToAdd} tracks) has been added to the queue by **${message.author.tag}**\nYou have reached the **maximum** amount of songs (${patreon.defaultMaxSongs} songs). Want more songs? Consider donating here: https://www.patreon.com/eartensifier`);
					else if (await songLimit() == patreon.premiumMaxSongs) msg.edit(`**${playlistInfo.title}** (${songsToAdd} tracks) has been added to the queue by **${message.author.tag}**\nYou have reached the **maximum** amount of songs (${patreon.premiumMaxSongs} songs). Want more songs? Consider donating here: https://www.patreon.com/eartensifier`);
					else if (await songLimit() == patreon.proMaxSongs) msg.edit(`**${playlistInfo.title}** (${songsToAdd} tracks) has been added to the queue by **${message.author.tag}**\nYou have reached the **maximum** amount of songs (${patreon.proMaxSongs} songs). Want more songs? Contact \`Tetra#0001\``);
				}
				else { msg.edit(`**${playlistInfo.title}** (${songsToAdd} tracks) has been added to the queue by **${message.author.tag}**`); }
			}
			else if (data.type == 'track') {
				const track = await getPreview(args.join(' '));
				play(client, message, msg, player, `${track.title} ${track.artist}`, false);
			}
		}
		else {
			return message.channel.send('Please provide a spotify album or track url.');
		}

		async function songLimit() {
			const hasPremium = await premium(message.author.id, 'Premium');
			const hasPro = await premium(message.author.id, 'Pro');
			if (!hasPremium && !hasPro) return patreon.defaultMaxSongs;
			if (hasPremium && !hasPro) return patreon.premiumMaxSongs;
			if (hasPremium && hasPro) return patreon.proMaxSongs;
		}
	},
};