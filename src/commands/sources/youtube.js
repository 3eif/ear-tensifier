const Command = require('../../structures/Command');

const play = require('../../utils/music/play.js');
const spawnPlayer = require('../../player/spawnPlayer.js');
const patreon = require('../../../config/patreon.js');
const premium = require('../../utils/premium.js');

module.exports = class Youtube extends Command {
	constructor(client) {
		super(client, {
			name: 'youtube',
			description: 'Plays a song from youtube.',
			args: true,
			usage: '<search query>',
			inVoiceChannel: true,
		});
	}
	async run(client, message, args) {
		if (!args[0]) return message.channel.send('Please provide a search query.');

		const permissions = message.member.voice.channel.permissionsFor(client.user);
		if (!permissions.has('CONNECT')) return client.responses('noPermissionConnect', message);
		if (!permissions.has('SPEAK')) return client.responses('noPermissionSpeak', message);

		let player = client.music.players.get(message.guild.id);
		if (player && player.playing === false) return message.channel.send(`Cannot play/queue songs while paused. Do \`${client.settings.prefix} resume\` to play.`);
		if (!player) player = await spawnPlayer(client, message);

		const msg = await message.channel.send(`${client.emojiList.cd}  Searching for \`${args.join(' ')}\`...`);

		if (await songLimit() == patreon.defaultMaxSongs && player.queue.length >= patreon.defaultMaxSongs) return msg.edit(`You have reached the **maximum** amount of songs (${patreon.defaultMaxSongs} songs). Want more songs? Consider donating here: https://www.patreon.com/eartensifier`);
		if (await songLimit() == patreon.premiumMaxSongs && player.queue.length >= patreon.premiumMaxSongs) return msg.edit(`You have reached the **maximum** amount of songs (${patreon.premiumMaxSongs} songs). Want more songs? Consider donating here: https://www.patreon.com/eartensifier`);
		if (await songLimit() == patreon.proMaxSongs && player.queue.length >= patreon.proMaxSongs) return msg.edit(`You have reached the **maximum** amount of songs (${patreon.proMaxSongs} songs). Want more songs? Contact the developer: \`Tetra#0001\``);

		const searchQuery = {
			source: 'youtube',
			query: args.slice(0).join(' '),
		};

		play(client, message, msg, player, searchQuery, false);

		async function songLimit() {
			const hasPremium = await premium(message.author.id, 'Premium');
			const hasPro = await premium(message.author.id, 'Pro');
			if (!hasPremium && !hasPro) return patreon.defaultMaxSongs;
			if (hasPremium && !hasPro) return patreon.premiumMaxSongs;
			if (hasPremium && hasPro) return patreon.proMaxSongs;
		}
	}
};