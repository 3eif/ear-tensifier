/* eslint-disable no-unused-vars */
const { EmbedBuilder } = require('discord.js');
const { ApplicationCommandOptionType, ApplicationCommandType } = require('discord.js');

const Command = require('../../structures/Command');
const Playlist = require('../../models/Playlist');
const formatDuration = require('../../utils/music/formatDuration');

module.exports = class View extends Command {
    constructor(client) {
        super(client, {
            name: 'view',
            description: {
                content: 'View the songs in a certain playlist.',
                usage: '<playlist name>',
                examples: ['Random_Access_Memories'],
            },
            args: true,
            aliases: ['viewplaylist', 'playlist'],
            options: [
                {
                    name: 'playlist',
                    type: ApplicationCommandOptionType.String,
                    required: true,
                    description: 'The playlist\'s name.',
                    autocomplete: true,
                },
            ],
            slashCommand: true,
        });
    }
    async run(client, ctx, args) {
        const playlistName = args.slice(0).join(' ');

        Playlist.findOne({
            name: playlistName,
            creator: ctx.author.id,
        }, async (err, p) => {
            if (err) client.logger.error(err);

            if (!p) {
                const embed = new EmbedBuilder()
                    .setAuthor({ name: playlistName, iconURL: ctx.author.displayAvatarURL() })
                    .setDescription(`${client.config.emojis.failure} Could not find a playlist by the name ${playlistName}.\nFor a list of your playlists type \`/playlists\``)
                    .setTimestamp()
                    .setColor(client.config.colors.default);
                return ctx.sendEphemeralMessage({ embeds: [embed] });
            }

            let pagesNum = Math.ceil(p.tracks.length / 10);
            if (pagesNum === 0) pagesNum = 1;

            let totalQueueDuration = 0;
            for (let i = 0; i < p.tracks.length; i++) {
                totalQueueDuration += p.tracks[i].duration;
            }

            const pages = [];
            let n = 1;
            for (let i = 0; i < pagesNum; i++) {
                const str = `${p.tracks.slice(i * 10, i * 10 + 10).map(song => `**${n++}.** [${song.title}](${song.url}) \`[${formatDuration(song.duration)}]\``).join('\n')}`;
                const embed = new EmbedBuilder()
                    .setAuthor({ name: ctx.author.tag, iconURL: ctx.author.displayAvatarURL() })
                    .setThumbnail(ctx.author.displayAvatarURL())
                    .setTitle(p.name)
                    .setDescription(str)
                    .setColor(client.config.colors.default)
                    .setTimestamp()
                    .setFooter({ text: `Page ${i + 1}/${pagesNum} | ${p.tracks.length} songs | ${formatDuration(totalQueueDuration)} total duration` });
                pages.push(embed);
            }
            return ctx.messageHelper.paginate(pages);
        });
    }
};