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
		if (!newVoice.guild.members.cache.get(this.client.user.id).voice.channelId) player.destroy();
		if (oldVoice.id === this.client.user.id) return;
		if (!oldVoice.guild.members.cache.get(this.client.user.id).voice.channelId) return;
		if (oldVoice.guild.members.cache.get(this.client.user.id).voice.channel.id === oldVoice.channelId) {
			if (oldVoice.guild.me.voice.channel?.members.filter(member => !member.user.bot).size < 1) {
				const vcName = oldVoice.guild.me.voice.channel.name;
				const embed = new MessageEmbed()
					.setDescription(`Leaving ${this.client.emojiList.voice}**${vcName}** in ${this.client.settings.voiceLeave / 1000} seconds because I was left alone.`)
					.setColor(colors.main);
				const msg = await player.get("textChannel").send({ embeds: [embed] });
				const delay = ms => new Promise(res => setTimeout(res, ms));
				await delay(this.client.settings.voiceLeave);

				const vcMembers = oldVoice.guild.me.voice.channel.members.filter(member => !member.user.bot).size;
				if (!vcMembers || vcMembers === 1) {
					const newPlayer = this.client.music.players.get(newVoice.guild.id);
					if (newPlayer) {
						player.destroy();
					}
					else { oldVoice.guild.me.voice.channel.leave(); }

					const embed2 = new MessageEmbed()
						.setDescription(`I left ${this.client.emojiList.voice}**${vcName}** because I was left alone.`)
						.setColor(colors.main);
					return msg.edit({ embeds: [embed2], content: ' ' });
				}
				else { return msg.delete(); }
			}
		}
	}
};
