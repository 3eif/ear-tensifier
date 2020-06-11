const { Player } = require('erela.js');

module.exports = async (client, message) => {
    const player = new Player({
        guild: message.guild,
        textChannel: message.channel,
        voiceChannel: message.member.voice.channel,
        selfDeaf: true,
    });

    player.twentyFourSeven = false;
    player.connect();

    return player;
};