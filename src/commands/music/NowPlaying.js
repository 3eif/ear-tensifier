const { EmbedBuilder } = require('discord.js');

const Command = require('../../structures/Command');
const formatDuration = require('../../utils/music/formatDuration');

module.exports = class NowPlaying extends Command {
    constructor(client) {
        super(client, {
            name: 'nowplaying',
            description: {
                content: 'Displays the song that is currently playing',
            },
            aliases: ['playing', 'np'],
            voiceRequirements: {
                isPlaying: true,
            },
            slashCommand: true,
        });
    }
    async run(client, ctx) {
        const player = client.music.players.get(ctx.guild.id);
        const { title, author, requester, url, thumbnail } = player.queue.current;
        const duration = player.getDuration();

        const parsedCurrentDuration = formatDuration(player.getTime() || 0);
        const parsedDuration = formatDuration(duration);
        const part = Math.floor((player.getTime() / duration) * 13);
        const percentage = player.getTime() / duration;

        const embed = new EmbedBuilder()
            .setColor(client.config.colors.default)
            .setAuthor({ name: author, iconURL: player.playing ? 'https://eartensifier.net/images/cd.gif' : 'https://eartensifier.net/images/cd.png', url: url })
            .setThumbnail(thumbnail)
            .setTitle(title)
            .setURL(url)
            .setDescription(`${parsedCurrentDuration}  ${percentage < 0.05 ? client.config.emojis.progress7 : client.config.emojis.progress1}${client.config.emojis.progress2.repeat(part)}${percentage < 0.05 ? '' : client.config.emojis.progress3}${client.config.emojis.progress5.repeat(12 - part)}${client.config.emojis.progress6}  ${parsedDuration}`)
            .setFooter({ text: requester.username })
            .setTimestamp();
        return ctx.sendMessage({ content: null, embeds: [embed] });
    }
};
