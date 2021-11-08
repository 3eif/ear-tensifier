const Command = require('../../structures/Command');
const QueueHelper = require('../../structures/QueueHelper');

module.exports = class Play extends Command {
	constructor(client) {
		super(client, {
			name: 'play',
			description: {
				content: 'Plays a song or playlist.',
				usage: '<search query>',
				examples: ['ear play resonance', 'ear play https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'ear play https://open.spotify.com/track/5hVghJ4KaYES3BFUATCYn0?si=44452e03da534c75'],
			},
			args: true,
			voiceRequirements: {
				isInVoiceChannel: true,
			},
			options: [
				{
					name: 'query',
					value: 'query',
					type: 3,
					required: true,
					description: 'The query to search for.',
				},
			],
			slashCommand: true,
		});
	}

	async run(client, message, args) {
		const msg = await message.channel.send(`${client.config.emojis.loading}  Searching for \`${args.join(' ')}\`...`);

		const query = args.slice(0).join(' ');

		let player = client.music.players.get(message.guild.id);
		if (!player) {
			player = client.music.newPlayer(message.guild, message.member.voice.channel, message.channel);
			player.connect();
		}

		if (player.queue.length > client.config.max.songsInQueue) return msg.edit(`You have reached the **maximum** amount of songs (${client.config.max.songsInQueue})`);

		const track = await client.music.search(query, message.author);

		player.queue.add(track);
		if (!player.playing) player.play();

		msg.edit({ content: null, embeds: [QueueHelper.queuedEmbed(track.title, client.config.urls.youtube + track.id, track.duration, null, message.author, client.config.colors.default)] });
	}

	async execute(client, interaction, args) {
		const query = args[0].value;

		let player = client.music.players.get(interaction.guild.id);
		if (!player) {
			player = client.music.newPlayer(interaction.guild, interaction.member.voice.channel, interaction.channel);
			player.connect();
		}

		if (player.queue.length > client.config.max.songsInQueue) return interaction.reply(`You have reached the **maximum** amount of songs (${client.config.max.songsInQueue})`);

		const track = await client.music.search(query, interaction.user);

		player.queue.add(track);
		if (!player.playing) player.play();

		await interaction.reply({ embeds: [QueueHelper.queuedEmbed(track.title, client.config.urls.youtube + track.id, track.duration, null, interaction.user, client.config.colors.default)] });
	}
};
