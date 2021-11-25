const { MessageEmbed } = require('discord.js');
const formatDuration = require('../utils/music/formatDuration');

module.exports = class QueueHelper {
    static queuedEmbed(trackName, trackLink, trackDuration, tracks, trackRequester, color) {
        let embedString = 'Queued ';
        if (trackName && !trackLink) embedString += `**${trackName}**`;
        if (trackName && trackLink) embedString += `**[${trackName}](${trackLink})**`;
        if (trackDuration) embedString += ` [${formatDuration(trackDuration)}]`;
        if (tracks) embedString += ` (${tracks} tracks)`;
        if (trackRequester) {
            if (!trackRequester.id) embedString += ` • <@${trackRequester}>`;
            else embedString += ` • <@${trackRequester.id}>`;
        }

        const embed = new MessageEmbed()
            .setDescription(embedString)
            .setColor(color);
        return embed;
    }

    static reduceThumbnails(thumbnails) {
        if (!thumbnails || !thumbnails.length)
            return undefined;
        return thumbnails.reduce((best, cur) => {
            return cur.width > best.width ? cur : best;
        }).url;
    }
};