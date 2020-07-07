module.exports = async (client, message) => {
    const player = await client.music.create(message.guild.id);

    player.twentyFourSeven = false;
    player.previous = null;
    await player.connect(message.member.voice.channel.id, { selfDeaf: true });

    return player;
};