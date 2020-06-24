const Command = require('../../structures/Command');

module.exports = class Previous extends Command {
	constructor(client) {
		super(client, {
			name: 'previous',
			description: 'Plays the previous song in the queue',
			cooldown: '4',
			inVoiceChannel: true,
			sameVoiceChannel: true,
			playing: true,
		});
	}
	async run(client, message) {
        const player = client.music.players.get(message.guild.id);
        if(player.previous == null) return message.channel.send('There are no previous songs.');
        player.queue.unshift(player.previous);
        player.stop();
	}
};