module.exports = player => {
  if (!player.queue.length) return player.queue.current.duration;

  return player.queue.reduce((prev, curr) => prev + curr.duration, 0) + player.queue.current.duration;
};
