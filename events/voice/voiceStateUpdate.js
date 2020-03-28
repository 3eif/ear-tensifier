const Event = require('../../structures/Event');

module.exports = class VoiceStateUpdate extends Event {
	constructor(...args) {
		super(...args);
	}

	// eslint-disable-next-line no-unused-vars
	async run(oldVoice, newVoice) {
		// if(oldVoice.guild.me.voice.channel == null) return;
		// const player = this.client.music.players.get(oldVoice.guild.id);
		// if (!player) return;

		// if (oldVoice.id === this.client.user.id) return;
		// if (oldVoice.guild.members.cache.get(this.client.user.id).voice.channel.id === oldVoice.channelID) {
		// 	if (oldVoice.guild.voice.channel && oldVoice.guild.voice.channel.members.size === 1) {
		// 		const msg = await player.textChannel.send(`Leaving ${this.client.emojiList.voice}**${oldVoice.guild.members.cache.get(this.client.user.id).voice.channel.name}** in ${this.client.settings.voiceLeave / 1000} seconds because I was left alone.`);
		// 		const delay = ms => new Promise(res => setTimeout(res, ms));
		// 		console.log(oldVoice.guild.members.cache.get(this.client.user.id).voice.channel.members.size);
		// 		console.log(oldVoice.guild.members.cache.get(this.client.user.id).voice.channel.members.length);
		// 		await delay(this.client.settings.voiceLeave);

		// 		const vcMembers = oldVoice.guild.members.cache.get(this.client.user.id).voice.channel.members.size;
		// 		if(!vcMembers || (vcMembers - 1) > 0) return msg.delete();

		// 		const newPlayer = this.client.music.players.get(oldVoice.guild.id);
		// 		if(newPlayer) {
		// 			newPlayer.queue = [];
		// 			newPlayer.stop();
		// 		}

		// 		msg.edit(`I left ${this.client.emojiList.voice}**${oldVoice.guild.members.cache.get(this.client.user.id).voice.channel.name}** because I was left alone.`);
		// 	}
		// }
	}
};