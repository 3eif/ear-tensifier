const { MessageEmbed } = require('discord.js');
const Event = require('../../structures/Event');

module.exports = class VoiceStateUpdate extends Event {
    constructor(...args) {
        super(...args);
    }

    async run(oldState, newState) {
        const player = this.client.music.players.get(oldState.guild.id);

        if (!player || player.stayInVoice || !oldState.guild.me.voice.channel || !newState.guild.me.voice.channel) return;
        if (newState.guild.me.voice.channel.members.filter(member => !member.user.bot).size >= 1) {
            if (player.waitingMessage) {
                player.waitingMessage.delete();
                player.waitingMessage = null;
                player.pause(false);
            }
            return;
        }

        if (!player.player || player.waitingMessage) return;
        const embed = new MessageEmbed()
            .setDescription(`Leaving <#${oldState.guild.me.voice.channel.id}> in ${this.client.config.voiceTimeout / 60 / 1000} minutes because I was left alone.`)
            .setColor(this.client.config.colors.default);
        const msg = await player.textChannel.send({ embeds: [embed] });
        player.waitingMessage = msg;
        player.pause(true);

        const delay = ms => new Promise(res => setTimeout(res, ms));
        await delay(this.client.config.voiceTimeout);

        if (!player.waitingMessage) return;
        if (!newState.guild.me.voice.channel) return;
        const voiceMembers = newState.guild.me.voice.channel.members.filter(member => !member.user.bot).size;
        if (!voiceMembers || voiceMembers == 0) {
            let newPlayer = this.client.music.players.get(newState.guild.id);
            if (player) {
                newPlayer.destroy(false);
            }
            else {
                newPlayer = await this.client.music.newPlayer(oldState.guild, oldState.guild.me.voice.channel, player.textChannel);
                await newPlayer.connect();
                newPlayer.destroy(false);
            }

            const embed2 = new MessageEmbed()
                .setDescription(`I left <#${oldState.guild.me.voice.channel.id}> because I was left alone.`)
                .setColor(this.client.config.colors.default);
            return msg.edit({ embeds: [embed2], content: null });
        }
        else return msg.delete();
    }
};