module.exports = async (player) => {
    if (player.queue.length == 0) return player.current.length;

    let totalQueueDuration = 0;
    for(let i = 0; i < player.queue.length; i++) {
        totalQueueDuration += player.queue[i].length;
    }
    return totalQueueDuration;
};