const { MessageEmbed } = require('discord.js');

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
            voiceRequuirements: {
                isPlaying: true,
            },
            slashCommand: true,
        });
    }
    async run(client, ctx) {
        const player = client.music.players.get(ctx.guild.id);
        const { title, author, duration, requester, url, thumbnail } = player.queue.current;

        const parsedCurrentDuration = formatDuration(player.getTime());
        const parsedDuration = formatDuration(duration);
        const part = Math.floor((player.getTime() / duration) * 30);
        const uni = player.playing ? '▶' : '⏸️';

        const user = `<@${!requester.id ? requester : requester.id}>`;

        const embed = new MessageEmbed()
            .setColor(client.config.colors.default)
            .setAuthor(player.playing ? 'Now Playing' : 'Paused', player.playing ? 'https://eartensifier.net/images/cd.gif' : 'https://eartensifier.net/images/cd.png')
            .setThumbnail(thumbnail)
            .setDescription(`**[${title}](${url})**`)
            .addField('Author', author, true)
            .addField('Requested By', user, true)
            .addField('Duration', `\`\`\`${parsedCurrentDuration}/${parsedDuration}  ${uni} ${'─'.repeat(part) + '⚪' + '─'.repeat(30 - part)}\`\`\``);
        return ctx.sendMessage({ content: null, embeds: [embed] });
    }
};
