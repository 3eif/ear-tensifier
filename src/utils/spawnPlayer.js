module.exports = async (client, message) => {
    const player = client.manager.players.spawn({
        guild: message.guild,
        textChannel: message.channel,
        voiceChannel: message.member.voice.channel,
        selfDeaf: true,
    });

    player.twentyFourSeven = false;

    return player;
};