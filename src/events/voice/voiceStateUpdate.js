const Event = require('../../structures/Event');

module.exports = class VoiceStateUpdate extends Event {
	constructor(...args) {
		super(...args);
	}

	// eslint-disable-next-line no-unused-vars
	async run(oldVoice, newVoice) {
		const player = this.client.music.players.get(oldVoice.guild.id);
		if (!player) return;

		if (oldVoice.id === this.client.user.id) return;
		if (!oldVoice.guild.members.cache.get(this.client.user.id).voice.channelID) return;
		if (oldVoice.guild.members.cache.get(this.client.user.id).voice.channel.id === oldVoice.channelID) {
			if (oldVoice.guild.voice.channel && oldVoice.guild.voice.channel.members.size === 1) {
				const vcName = oldVoice.guild.me.voice.channel.name;
				const msg = await player.textChannel.send(`Leaving ${this.client.emojiList.voice}**${vcName}** in ${this.client.settings.voiceLeave / 1000} seconds because I was left alone.`);
				const delay = ms => new Promise(res => setTimeout(res, ms));
				await delay(this.client.settings.voiceLeave);

				const vcMembers = oldVoice.guild.voice.channel.members.size;
				if (vcMembers == 0) {
					const newPlayer = this.client.music.players.get(newVoice.guild.id);
					if (newPlayer) {
						this.client.music.players.destroy(player.guild.id);
					}
					else { oldVoice.guild.voice.channel.leave(); }

					return msg.edit(`I left ${this.client.emojiList.voice}**${vcName}** because I was left alone.`);
				}
				if (!vcMembers || (vcMembers - 1) > 0) return msg.delete();
			}
		}
	}
};