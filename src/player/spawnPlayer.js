const trackStart = require('./trackStart.js');
const nextTrack = require('./nextTrack.js');

module.exports = async (client, message) => {
    const player = await client.music.create(message.guild.id);

    player.twentyFourSeven = false;
    player.textChannel = message.channel;
    player.previous = null;
    player.futurePrevious = null;
    await player.connect(message.member.voice.channel.id, { selfDeaf: true });

    player.queue
        .on('finished', async () => {
            await player.destroy(false);
            return player.disconnect(true);
        })
        .on('started', (next) => {
            trackStart(client, player.textChannel, next);
        })
        .on('next', (next) => {
            nextTrack(client, player, next);
        });

    return player;
};