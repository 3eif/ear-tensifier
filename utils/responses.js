const Discord = require("discord.js");

module.exports = async (type, message, args) => {
    switch (type) {
        case 'reloadError': {
            message.channel.send(`An error occured while reloading \`${args}\`.`)
            break;
        }
        case 'sameVoiceChannel': {
            message.channel.send(`You are not in the same voice channel as the bot.`)
            break;
        }
        case 'noVoiceChannel': {
            message.channel.send(`You need to be in a voice channel to use this command`);
            break;
        }
        case 'noSongsPlaying': {
            message.channel.send(`There are no songs currently playing, please play a song to use the command.`)
            break;
        }
        default: {
            message.channel.send(client.error());
        }
    }
}