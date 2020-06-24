const { Player } = require('@tetracyl/erela.js');

module.exports = async (client, message) => {
    const player = new Player({
        guild: message.guild,
        textChannel: message.channel,
        voiceChannel: message.member.voice.channel,
        selfDeafen: true,
    });

    player.twentyFourSeven = false;
    player.previous = null;
    player.connect();

    return player;
};