const premium = require('../../utils/premium.js');

module.exports = {
    name: "eq",
    description: "Sets the equalizer of the current playing song.",
    args: true,
    async execute(client, message, args) {
        // if(!premium(message.author.id, "Supporter")) return message.channel.send(`This command is only available to **Premium** users. Click here to get premium: https://www.patreon.com/join/eartensifier`)

        // const voiceChannel = message.member.voice.channel;
        // const player = client.music.players.get(message.guild.id);

        // if(!voiceChannel) return client.responses('noVoiceChannel', message);
        // if(voiceChannel.id != message.guild.members.cache.get(client.user.id).voice.channel.id) return client.responses('sameVoiceChannel', message);

        // if(!player) return client.responses('noSongsPlaying', message)
    }
}