module.exports = player => {
  if (!player.queue.length) return player.current.duration;

  return player.queue.reduce((prev, curr) => prev + curr.duration, 0) + player.current.duration;
};
