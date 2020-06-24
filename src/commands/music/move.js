const Command = require('../../structures/Command');

module.exports = class Move extends Command {
	constructor(client) {
		super(client, {
			name: 'move',
			description: 'Moves a song to another location in the queue.',
			args: true,
			usage: '<old position> <new position>',
			cooldown: '4',
			inVoiceChannel: true,
			sameVoiceChannel: true,
			playing: true,
		});
	}
	async run(client, message, args) {
		if (isNaN(args[0])) return message.channel.send('Invalid number.');
		if (args[0] === 0) return message.channel.send(`Cannot move a song that is already playing. To skip the current playing song type: \`${client.settings.prefix}skip\``);

		const player = client.music.players.get(message.guild.id);
		if ((args[0] > player.queue.length) || (args[0] && !player.queue[args[0]])) return message.channel.send('Song not found.');

		if (!args[1]) {
			const song = player.queue[args[0] - 1];
			player.queue.splice(args[0] - 1, 1);
			player.queue.splice(0, 0, song);
			return message.channel.send(`Moved **${song.title}** to the beginning of the queue.`);
		}
		else if (args[1]) {
			if (args[1] == 0) return message.channel.send(`Cannot move a song that is already playing. To skip the current playing song type: \`${client.settings.prefix}skip\``);
			if ((args[1] > player.queue.length) || !player.queue[args[1]]) return message.channel.send('Song not found.');
			const song = player.queue[args[0] - 1];
			player.queue.splice(args[0] - 1, 1);
			player.queue.splice(args[1] - 1, 0, song);
			return message.channel.send(`Moved **${song.title}** to the position ${args[1]}.`);
		}
	}
};