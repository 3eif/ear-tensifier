const { decode } = require("@lavalink/encoding");

module.exports = async (client, message) => {
    const player = await client.music.create(message.guild.id);

    player.twentyFourSeven = false;
    player.textChannel = message.channel;
    await player.connect(message.member.voice.channel.id, { selfDeaf: true });

    function trackStarted(next) {
        const { title, length, author, uri } = decode(next.song);
        require("./trackStart")(client, player.textChannel, title, Number(length), author, uri);
    }

    player.queue
        .on("finished", async () => {
            await player.destroy(false);
            return player.disconnect(true);
        })
        .on("started", trackStarted)
        .on("next", trackStarted);

    return player;
};