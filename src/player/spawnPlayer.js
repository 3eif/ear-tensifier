const trackStart = require('./trackStart.js');

module.exports = async (client, message) => {
    const player = await client.music.create(message.guild.id);

    player.twentyFourSeven = false;
    player.textChannel = message.channel;
    player.previous = null;
    await player.connect(message.member.voice.channel.id, { selfDeaf: true });

    player.queue
        .on('finished', async () => {
            await player.destroy(false);
            return player.disconnect(true);
        })
        .on('trackStart', (next) => {
            trackStart(client, player.textChannel, next);
        })
        .on('trackEnd', (current) => {
            player.previous = current;
            player.msgSent = false;
        });

    return player;
};