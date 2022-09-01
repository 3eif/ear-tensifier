const { Source } = require('yasha');
const { ApplicationCommandOptionType, PermissionsBitField } = require('discord.js');

const Command = require('../../structures/Command');
const QueueHelper = require('../../helpers/QueueHelper');

module.exports = class Spotify extends Command {
    constructor(client) {
        super(client, {
            name: 'file',
            description: {
                content: 'Plays a file.',
                usage: '<attachment>',
                examples: [
                    'https://open.spotify.com/track/1pKYYY0dkg23sQQXi0Q5zN?si=75df097fdbb54572',
                    'https://open.spotify.com/album/5uRdvUR7xCnHmUW8n64n9y?si=-x7dShkeTS-aqFvlDCG8GA',
                    'https://open.spotify.com/playlist/4ESFBGQQZEM426tyQo61Nt?si=8d376ef5dc2e403a',
                ],
            },
            aliases: ['filetrack', 'playfile'],
            args: false,
            voiceRequirements: {
                isInVoiceChannel: true,
            },
            options: [
                {
                    name: 'attachment',
                    description: 'Plays the attached file.',
                    type: ApplicationCommandOptionType.Subcommand,
                    options: [
                        {
                            name: 'file',
                            type: ApplicationCommandOptionType.Attachment,
                            required: true,
                            description: 'The attached file to play.',
                        },
                    ],
                },
                {
                    name: 'link',
                    description: 'Plays the link to the file.',
                    type: ApplicationCommandOptionType.Subcommand,
                    options: [
                        {
                            name: 'file',
                            type: ApplicationCommandOptionType.String,
                            required: true,
                            description: 'The link to the file to play.',
                        },
                    ],
                },
            ],
            permissions: {
                botPermissions: [PermissionsBitField.Flags.Connect, PermissionsBitField.Flags.Speak],
            },
            slashCommand: true,
        });
    }

    async run(client, ctx, args) {
        await ctx.sendDeferMessage(`${client.config.emojis.typing} Fetching file...`);

        let attachmentLink;
        let attachmentName;
        if (ctx.isInteraction) {
            if (ctx.interaction.options.data[0].name && ctx.interaction.options.data[0].options[0].attachment) {
                const slashCommandAttachment = ctx.interaction.options.data[0].options[0].attachment;
                attachmentLink = slashCommandAttachment.url;
                attachmentName = slashCommandAttachment.name;
            }
            else {
                attachmentLink = ctx.interaction.options.data[0].options[0].value;
                attachmentName = 'Unknown Title';
            }
        }
        else {
            if (!ctx.attachments && !args[0]) return ctx.editMessage('You did not provide an attachment or link of the file.');
            if (ctx.attachments.size > 0) {
                attachmentLink = ctx.message.attachments.first().url;
                attachmentName = ctx.message.attachments.first().name;
            }
            else {
                attachmentLink = args[0];
                attachmentName = 'Unknown Title Track';
            }
        }

        let player = client.music.players.get(ctx.guild.id);
        if (!player) {
            player = await client.music.newPlayer(ctx.guild, ctx.member.voice.channel, ctx.channel);
            player.connect();
        }

        if (player.queue.length > client.config.max.songsInQueue) return ctx.editMessage(`You have reached the **maximum** amount of songs (${client.config.max.songsInQueue})`);

        let result;
        try {
            result = await Source.File.resolve(attachmentLink);
            result.title = attachmentName;
            result.author = 'Unknown Author';
            result.requester = ctx.author;

            if (result.isLocalFile) return ctx.editMessage('No results found.');
        }
        catch (error) {
            return ctx.editMessage('No results found.');
        }

        player.queue.add(result);
        if (!player.playing && !player.paused) player.play();

        ctx.editMessage({ content: null, embeds: [QueueHelper.queuedEmbed(result.title, result.url, result.duration, null, ctx.author, client.config.colors.default)] });
    }
};
