const Event = require('../../structures/Event');
const { MessageEmbed } = require('discord.js');
const colors = require('../../../config/colors.js');

module.exports = class VoiceStateUpdate extends Event {
	constructor(...args) {
		super(...args);
	}

	async run(oldVoice, newVoice) {

		const player = this.client.music.players.get(oldVoice.guild.id);

		if (!player) return;
		if (player.twentyFourSeven) return;
		if (!newVoice.guild.members.cache.get(this.client.user.id).voice.channelID) player.destroy();
		if (oldVoice.id === this.client.user.id) return;
		if (!oldVoice.guild.members.cache.get(this.client.user.id).voice.channelID) return;
		if (oldVoice.guild.members.cache.get(this.client.user.id).voice.channel.id === oldVoice.channelID) {
			if (oldVoice.guild.voice.channel && oldVoice.guild.voice.channel.members.size === 1) {
				const vcName = oldVoice.guild.me.voice.channel.name;
				const embed = new MessageEmbed()
					.setDescription(`Leaving ${this.client.emojiList.voice}**${vcName}** in ${this.client.settings.voiceLeave / 1000} seconds because I was left alone.`)
					.setColor(colors.main);
				const msg = await player.textChannel.send(embed);
				const delay = ms => new Promise(res => setTimeout(res, ms));
				await delay(this.client.settings.voiceLeave);

				const vcMembers = oldVoice.guild.voice.channel.members.size;
				if (!vcMembers || vcMembers === 1) {
					const newPlayer = this.client.music.players.get(newVoice.guild.id);
					if (newPlayer) {
						player.destroy();
					}
					else { oldVoice.guild.voice.channel.leave(); }

					const embed2 = new MessageEmbed()
						.setDescription(`I left ${this.client.emojiList.voice}**${vcName}** because I was left alone.`)
						.setColor(colors.main);
					return msg.edit(embed2, '');
				}
				else { return msg.delete(); }
			}
		}
	}
};