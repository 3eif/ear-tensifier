const Command = require('../../structures/Command');

const Playlist = require('../../models/Playlist');
const { MessageEmbed } = require('discord.js');
const humanizeDuration = require('humanize-duration');

module.exports = class Playlists extends Command {
    constructor(client) {
        super(client, {
            name: 'playlists',
            description: {
                content: 'View all your playlists.',
            },
            args: false,
            slashCommand: true,
        });
    }
    async run(client, ctx) {
        Playlist.find({
            creator: ctx.author.id,
        }).sort({ createdTimestamp: 1 }).then(async (p) => {
            let pagesNum = Math.ceil(p.length / 10);
            if (pagesNum === 0) pagesNum = 1;

            const pages = [];
            for (let i = 0; i < pagesNum; i++) {
                const str = `${p.slice(i * 10, i * 10 + 10).map(playlist => `**• ${playlist.name}** | ${playlist.tracks.length} song(s) | ${humanizeDuration(Number(Date.now() - playlist.createdTimestamp), { round: true })} ago`).join('\n')}`;

                const embed = new MessageEmbed()
                    .setAuthor(ctx.author.username, ctx.author.displayAvatarURL())
                    .setDescription(`**__Your Playlists__**\n\n${str}`)
                    .setColor(client.config.colors.default)
                    .setTimestamp()
                    .setFooter(`Page ${i + 1}/${pagesNum} | ${p.length} playlists`);
                pages.push(embed);
            }
            if (pages > 1) ctx.messageHelper.paginate(pages);
            else ctx.sendMessage({ embeds: [pages[0]] });
        }).catch(err => {
            client.logger.error(err);
            const embed = new MessageEmbed()
                .setAuthor(ctx.author.username, ctx.author.displayAvatarURL())
                .setDescription(`${client.config.emojis.failure} You don't have any playlists.\nTo create a playlist type: \`ear create <playlist name> <search query/link>\``)
                .setTimestamp()
                .setColor(client.config.colors.default);
            return ctx.sendMessage({ embeds: [embed] });
        });
    }
};