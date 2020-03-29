module.exports = {
	name: 'loop',
	description: 'Repeats the current queue/song',
	aliases: ['repeat', 'unloop'],
	usage: '<queue/song>',
	cooldown: '10',
	async execute(client, message, args) {
		const voiceChannel = message.member.voice;
		const player = client.music.players.get(message.guild.id);

		if(!voiceChannel) return client.responses('noVoiceChannel', message);
		if(voiceChannel.id != message.guild.members.cache.get(client.user.id).voice.channel.id) return client.responses('sameVoiceChannel', message);

		if(!player) return client.responses('noSongsPlaying', message);

		if(!args[0] || args[0].toLowerCase() == 'song') {
			if(player.trackRepeat === false) {
				player.setTrackRepeat(true);
				return message.channel.send('Song is now being looped');
			}
			else{
				player.setTrackRepeat(false);
				return message.channel.send('Song has been unlooped');
			}
		}
		else if(args[0] == 'queue') {
			if(player.setQueueRepeat) {
				player.setQueueRepeat(false);
				return message.channel.send('Queue has been unlooped.');
			}
			else {
				player.setQueueRepeat(true);
				return message.channel.send('Queue is now being looped.');
			}
		}
	},
};