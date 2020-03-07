const Event = require('./Event');
const emojis = require("../data/emojis.json");

module.exports = class VoiceStateUpdate extends Event {
    constructor(...args) {
        super(...args)
    }

    async run(oldMember, newMember) {

        const player = this.client.music.players.get(oldMember.guild.id);
        if (!player) return;

        if (oldMember.id === this.client.user.id) return;
        if (oldMember.guild.members.cache.get(this.client.user.id).voiceChannel === oldMember.voiceChannel) {
            if ((oldMember.guild.members.cache.get(this.client.user.id).voice.channel.members.size - 1) === 0) {
                let msg = await player.textChannel.send(`Leaving ${emojis.voice}\`${oldMember.guild.members.cache.get(this.client.user.id).voice.channel.name}\` in 60 seconds because I was left alone.`)
                const delay = ms => new Promise(res => setTimeout(res, ms));
                await delay(this.client.settings.voiceLeave);
                if((oldMember.guild.members.cache.get(this.client.user.id).voice.channel.members.size - 1) > 0) return msg.delete();
                this.client.music.players.destroy(oldMember.guild.id);
                msg.edit(`${emojis.time} I left ${emojis.voice}\`${oldMember.guild.members.cache.get(this.client.user.id).voice.channel.name}\` becayse I was left alon.`)
            }
        }
    };
}