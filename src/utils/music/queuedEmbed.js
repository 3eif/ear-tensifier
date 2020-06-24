const { MessageEmbed } = require('discord.js');
const formatDuration = require('./formatDuration.js');
const { main } = require('../../../config/colors.js');

module.exports = (trackName, trackLink, trackDuration, tracks, trackRequester) => {
    let embedString = 'Queued ';
    if(trackName && !trackLink) embedString += `**${trackName}**`;
    if(trackName && trackLink) embedString += `**[${trackName}](${trackLink})**`;
    if(trackDuration) embedString += ` [${formatDuration(trackDuration)}]`;
    if(tracks) embedString += ` (${tracks} tracks)`;
    if(trackRequester) {
        if(!trackRequester.id) embedString += ` • <@${trackRequester}>`;
        else embedString += ` • <@${trackRequester.id}>`;
    }

    const embed = new MessageEmbed()
        .setDescription(embedString)
        .setColor(main);
    return embed;
};