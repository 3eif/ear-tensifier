module.exports = async (client, message) => {
    const player = client.music.players.spawn({
        guild: message.guild,
        textChannel: message.channel,
        voiceChannel: message.member.voice.channel,
    });

    const permissions = message.member.voice.channel.permissionsFor(client.user);
    if (permissions.has('DEAFEN_MEMBERS') || permissions.has('ADMINISTRATOR')) message.guild.members.cache.get(client.user.id).voice.setDeaf(true);

    return player;
};