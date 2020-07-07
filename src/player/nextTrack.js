const trackStart = require('./trackStart.js');

module.exports = async (client, player, next) => {
    player.previous = player.futurePrevious;
    trackStart(client, player.textChannel, next);
};