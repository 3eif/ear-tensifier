const Player = require('../../structures/Player');
const Command = require('../../structures/Command');

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
			options: [
				{
					name: 'query',
					value: 'query',
					type: 3,
					required: true,
					description: 'play command',
				},
			],
			slashCommand: true,
		});
	}

	async run(client, message, args) {
		const query = args.slice(0).join(' ');

		let player = client.music.players.get(message.guild.id);
		if (!player) {
			player = client.music.newPlayer(message.guild, message.member.voice.channel, message.channel);
			player.connect();
		}

		const track = await client.music.search(query);

		player.queue.add(track);
		if (!player.playing) player.play();

		message.channel.send(`Added **${track.title}** to the queue!`);
	}

	async execute(client, interaction, args) {
		const query = args[0].value;

		let player = client.music.players.get(interaction.guild.id);
		if (!player) player = new Player(client.music, interaction.guild, interaction.member.voice.channel, interaction.channel);

		const track = await client.music.search(query);

		player.queue.add(track);
		if (!player.playing) player.play();

		await interaction.reply(`Added **${track.title}** to the queue!`);
	}
};
