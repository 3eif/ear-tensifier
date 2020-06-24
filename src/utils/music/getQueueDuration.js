module.exports = player => {
    if (player.queue.length === 0) return player.current.duration;

    let totalQueueDuration = player.current.duration;
    for(let i = 0; i < player.queue.length; i++) {
        totalQueueDuration += player.queue[i].duration;
    }
    return totalQueueDuration;
};