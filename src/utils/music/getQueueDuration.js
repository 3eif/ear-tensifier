const { decode } = require('@lavalink/encoding');

module.exports = player => {
    const currentSongLength = Number(decode(player.queue.next[0].song).length) - player.position;
    if (player.queue.next.length === 0) return currentSongLength;

    let totalQueueDuration = currentSongLength;
    for(let i = 0; i < player.queue.length; i++) {
        totalQueueDuration += Number(decode(player.queue.next[i].song).length);
    }
    return totalQueueDuration;
};