/* eslint-disable no-unused-vars */
const Command = require('../../structures/Command');

const { MessageEmbed } = require('discord.js');
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
                    type: 3,
                    required: true,
                    description: 'The playlist\'s name.',
                },
            ],
            slashCommand: true,
        });
    }
    async run(client, ctx, args) {
        const playlistName = args.join(' ').replace(/_/g, ' ');

        Playlist.findOne({
            name: playlistName,
            creator: ctx.author.id,
        }, async (err, p) => {
            if (err) client.logger.erro(err);

            if (!p) {
                const embed = new MessageEmbed()
                    .setAuthor(playlistName, ctx.author.displayAvatarURL())
                    .setDescription(`${client.config.emojis.failure} Could not find a playlist by the name ${playlistName}.\nFor a list of your playlists type \`ear playlists\``)
                    .setTimestamp()
                    .setColor(client.config.colors.default);
                return ctx.sendMessage({ embeds: [embed] });
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
                const embed = new MessageEmbed()
                    .setAuthor(ctx.author.tag, ctx.author.displayAvatarURL())
                    .setThumbnail(ctx.author.displayAvatarURL())
                    .setTitle(p.name)
                    .setDescription(str)
                    .setColor(client.config.colors.default)
                    .setFooter(`ID: ${p._id}`)
                    .setTimestamp()
                    .setFooter(`Page ${i + 1}/${pagesNum} | ${p.tracks.length} songs | ${formatDuration(totalQueueDuration)} total duration`);
                pages.push(embed);
                if (i == pagesNum - 1 && pagesNum > 1) ctx.messageHelper.paginate(pages);
                else if (pagesNum == 1) ctx.sendMesasge({ embeds: [embed] });
            }
        });
    }
};