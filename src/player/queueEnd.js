module.exports = async (player) => {
    await player.destroy(false);
    return player.disconnect(true);
};