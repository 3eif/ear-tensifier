const Command = require('../../structures/Command');

const users = require('../../models/user.js');
const spawnPlayer = require('../../utils/spawnPlayer.js');
const premium = require('../../utils/premium/premium.js');
const patreon = require('../../../config/patreon.js');
const { getPreview } = require('spotify-url-info');

module.exports = class Load extends Command {
	constructor(client) {
		super(client, {
			name: 'load',
			description: 'Loads your favorite songs to the queue.',
			inVoiceChannel: true,
		});
	}
	async run(client, message, args) {
		const permissions = message.member.voice.channel.permissionsFor(client.user);
		if (!permissions.has('CONNECT')) return message.channel.send('I do not have permission to join your voice channel.');
		if (!permissions.has('SPEAK')) return message.channel.send('I do not have permission to speak in your voice channel.');

		let player = client.music.players.get(message.guild.id);
		if (player && player.playing == false) return message.channel.send(`Cannot play/queue songs while paused. Do \`${client.settings.prefix} resume\` to play.`);
		if (!player) player = await spawnPlayer(client, message);

		const msg = await message.channel.send(`${client.emojiList.cd}  Loading favorites (This might take a few seconds)...`);

		if (await songLimit() == patreon.defaultMaxSongs && player.queue.size >= patreon.defaultMaxSongs) return msg.edit(`You have reached the **maximum** amount of songs (${patreon.defaultMaxSongs} songs). Want more songs? Consider donating here: https://www.patreon.com/eartensifier`);
		if (await songLimit() == patreon.premiumMaxSongs && player.queue.size >= patreon.premiumMaxSongs) return msg.edit(`You have reached the **maximum** amount of songs (${patreon.premiumMaxSongs} songs). Want more songs? Consider donating here: https://www.patreon.com/eartensifier`);
		if (await songLimit() == patreon.proMaxSongs && player.queue.size >= patreon.proMaxSongs) return msg.edit(`You have reached the **maximum** amount of songs (${patreon.proMaxSongs} songs). Want more songs? Contact the developer: \`Tetra#0001\``);

		users.findOne({
			authorID: message.author.id,
		}, async (err, u) => {
			if (err) client.log(err);

			let songsToAdd = 0;
			// eslint-disable-next-line no-async-promise-executor
			const content = new Promise(async function(resolve) {
				if (u.favorites && u.favorites.length) {
					const sL = await songLimit();
					if (player.queue.length == 0) { songsToAdd = Math.min(sL, u.favorites.length); }
					else {
						const totalSongs = player.queue.length + u.favorites.length;
						if (totalSongs > sL) songsToAdd = Math.min(sL - player.queue.length, u.favorites.length);
						else songsToAdd = u.favorites.length;
					}
					for (let i = 0; i < songsToAdd; i++) {
						player.queue.push(u.favorites[i]);
						if (!player.playing) player.play();
						if (i == songsToAdd - 1) resolve();
					}
				}
				else {
					return msg.edit('You have no favorites. To add favorites type `ear add <search query/link>`');
				}
			});

			content.then(async function() {
				msg.edit(`Loaded **${songsToAdd} songs** into the queue. Type \`${client.settings.prefix}queue\` to see the queue.`);
				const loaded = `Loaded **${songsToAdd} songs** into the queue. Type \`${client.settings.prefix}queue\` to see the queue.`;
				const playlistInfo = await getPreview(args.join(' '));
				if (u.favorites.length != songsToAdd) {
					if (await songLimit() == patreon.defaultMaxSongs) msg.edit(`${loaded}.\nYou have reached the **maximum** amount of songs (${patreon.defaultMaxSongs} songs). Want more songs? Consider donating here: https://www.patreon.com/eartensifier`);
					else if (await songLimit() == patreon.premiumMaxSongs) msg.edit(`${loaded}\nYou have reached the **maximum** amount of songs (${patreon.premiumMaxSongs} songs). Want more songs? Consider donating here: https://www.patreon.com/eartensifier`);
					else if (await songLimit() == patreon.proMaxSongs) msg.edit(`${loaded}\nYou have reached the **maximum** amount of songs (${patreon.proMaxSongs} songs). Want more songs? Contact \`Tetra#0001\``);
				}
				else { msg.edit(`**${playlistInfo.title}** (${songsToAdd} tracks) has been added to the queue by **${message.author.tag}**`); }
			});
		});

		async function songLimit() {
			const hasPremium = await premium(message.author.id, 'Premium');
			const hasPro = await premium(message.author.id, 'Pro');
			if (!hasPremium && !hasPro) return patreon.defaultMaxSongs;
			if (hasPremium && !hasPro) return patreon.premiumMaxSongs;
			if (hasPremium && hasPro) return patreon.proMaxSongs;
		}
	}
};