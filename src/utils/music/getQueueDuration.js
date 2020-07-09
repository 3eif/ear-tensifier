module.exports = player => {
    const currentSongLength = Number(player.queue.current.length) - player.position;
    if (player.queue.tracks.length === 0) return currentSongLength;

    let totalQueueDuration = currentSongLength;
    for(let i = 0; i < player.queue.tracks.length; i++) {
        totalQueueDuration += player.queue.tracks[i].length;
    }
    return totalQueueDuration;
};