const { EmbedBuilder } = require('discord.js');
const Event = require('../../structures/Event');

module.exports = class VoiceStateUpdate extends Event {
    constructor(...args) {
        super(...args);
    }

    async run(oldState, newState) {
        const player = this.client.music.players.get(oldState.guild.id);

        if (!player || player.stayInVoice || !oldState.guild.members.me.voice.channel || !newState.guild.members.me.voice.channel) return;

        if (newState.guild.members.me.voice.channel.members.filter(member => !member.user.bot).size >= 1) {
            if (player.waitingMessage) {
                player.waitingMessage.delete();
                player.waitingMessage = null;
                if (!player.previouslyPaused) player.pause(false);
            }
            return;
        }

        if (!player.player || player.waitingMessage) return;
        const embed = new EmbedBuilder()
            .setDescription(`Leaving <#${oldState.guild.members.me.voice.channel.id}> in ${this.client.config.voiceTimeout / 60 / 1000} minutes because I was left alone.`)
            .setColor(this.client.config.colors.default);
        const msg = await player.textChannel.send({ embeds: [embed] });
        player.waitingMessage = msg;
        player.previouslyPaused = player.paused;
        player.pause(true);

        const delay = ms => new Promise(res => setTimeout(res, ms));
        await delay(this.client.config.voiceTimeout);

        if (!player.waitingMessage) return;
        if (!newState.guild.members.me.voice.channel) return;
        const voiceMembers = newState.guild.members.me.voice.channel.members.filter(member => !member.user.bot).size;
        if (!voiceMembers || voiceMembers == 0) {
            let newPlayer = this.client.music.players.get(newState.guild.id);
            if (player) {
                newPlayer.destroy(false);
            }
            else {
                newPlayer = await this.client.music.newPlayer(oldState.guild, oldState.guild.members.me.voice.channel, player.textChannel);
                await newPlayer.connect();
                newPlayer.destroy(false);
            }

            const embed2 = new EmbedBuilder()
                .setDescription(`I left <#${oldState.guild.members.me.voice.channel.id}> because I was left alone.`)
                .setColor(this.client.config.colors.default);
            return msg.edit({ embeds: [embed2], content: null });
        }
        else return msg.delete();
    }
};