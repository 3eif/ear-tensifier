const { EmbedBuilder } = require('discord.js');
const { ApplicationCommandOptionType } = require('discord.js');

const Command = require('../../structures/Command');
const Playlist = require('../../models/Playlist');

module.exports = class Delete extends Command {
    constructor(client) {
        super(client, {
            name: 'delete',
            description: {
                content: 'Deletes a playlist.',
                usage: '<playlist name>',
                examples: ['DSOTM'],
            },
            args: true,
            options: [
                {
                    name: 'playlist',
                    type: ApplicationCommandOptionType.String,
                    required: true,
                    description: 'The playlist\'s name.',
                    autocomplete: true,
                },
            ],
            slashCommand: false,
            enabled: false,        });
    }
    async run(client, ctx, args) {
        await ctx.sendDeferMessage(`${client.config.emojis.typing} Deleting playlist...`);

        const playlistName = args.join(' ').replace(/_/g, ' ');

        Playlist.findOneAndDelete({
            name: playlistName,
            creator: ctx.author.id,
        }).then(deletedDocument => {
            if (deletedDocument) {
                const embed = new EmbedBuilder()
                    .setAuthor({ name: playlistName, iconURL: ctx.author.displayAvatarURL() })
                    .setDescription(`${client.config.emojis.success} Deleted playlist: \`${playlistName}\``)
                    .setTimestamp()
                    .setColor(client.config.colors.default);
                return ctx.editMessage({ content: null, embeds: [embed] });
            }
            else {
                const embed = new EmbedBuilder()
                    .setAuthor({ name: playlistName, iconURL: ctx.author.displayAvatarURL() })
                    .setDescription(`${client.config.emojis.failure} Could not find a playlist by the name ${playlistName}.\nFor a list of your playlists type \`/playlists\``)
                    .setTimestamp()
                    .setColor(client.config.colors.default);
                return ctx.editMessage({ content: null, embeds: [embed] });
            }
        }).catch(err => ctx.editMessage(`${client.config.emojis.failure} Failed to find and delete document: ${err}`));
    }
};