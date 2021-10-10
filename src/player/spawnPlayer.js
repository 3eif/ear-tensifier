const Player = require('../structures/Player.js');

module.exports = async (client, message) => {
    const player = new Player({
        guild: message.guild.id,
        textChannel: message.channel.id,
        voiceChannel: message.member.voice.channel.id,
        selfDeafen: true,
    });

    player.set("textChannel", message.channel);
    player.connect();

    return player;
};