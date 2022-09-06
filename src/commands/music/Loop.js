const { ApplicationCommandOptionType, EmbedBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const Command = require('../../structures/Command');

module.exports = class Loop extends Command {
    constructor(client) {
        super(client, {
            name: 'loop',
            description: {
                content: 'Loops the current queue/song (song is looped by default if no argument is provided).',
            },
            aliases: ['repeat', 'unloop'],
            usage: '<queue/song>',
            cooldown: '4',
            voiceRequirements: {
                isInVoiceChannel: true,
                isInSameVoiceChannel: true,
                isPlaying: true,
            },
            options: [
                {
                    name: 'queue',
                    description: 'Loops the queue.',
                    type: ApplicationCommandOptionType.Subcommand,
                },
                {
                    name: 'song',
                    description: 'Loops the current song.',
                    type: ApplicationCommandOptionType.Subcommand,
                },
            ],
            slashCommand: true,
        });
    }

    async run(client, ctx, args) {
        const player = client.music.players.get(ctx.guild.id);

        let str;
        let style;
        let emoji;
        if ((ctx.isInteraction && ctx.interaction.options.data[0].name == 'song') || (!ctx.isInteraction && (!args[0] || args[0].toLowerCase() == 'song'))) {
            if (!player.trackRepeat) {
                player.setTrackRepeat(true);
                player.setQueueRepeat(false);
                str = 'Song is now being looped.';
                style = ButtonStyle.Primary;
                emoji = client.config.emojis.loopsong;
            }
            else {
                player.setQueueRepeat(false);
                player.setTrackRepeat(false);
                str = 'Song is no longer being looped.';
                style = ButtonStyle.Secondary;
                emoji = client.config.emojis.loop;
            }
        }
        else if ((ctx.isInteraction && ctx.interaction.options.data[0].name == 'queue') || (!ctx.isInteraction && args[0] == 'queue')) {
            if (player.queueRepeat) {
                player.setQueueRepeat(false);
                player.setTrackRepeat(false);
                str = 'Queue is no longer being looped.';
                style = ButtonStyle.Secondary;
                emoji = client.config.emojis.loop;
            }
            else {
                player.setQueueRepeat(false);
                player.setTrackRepeat(false);
                str = 'Queue is now being looped.';
                style = ButtonStyle.Primary;
                emoji = client.config.emojis.loop;
            }
        }
        const buttonRow = player.nowPlayingMessage.components[0];
        buttonRow.components[0] = new ButtonBuilder()
            .setCustomId('LOOP_BUTTON')
            .setStyle(style)
            .setEmoji(emoji);

        const embed = new EmbedBuilder()
            .setColor(client.config.colors.default)
            .setAuthor({ name: str, iconURL: ctx.author.displayAvatarURL() });
        await player.nowPlayingMessage.edit({ components: [buttonRow] });
        return ctx.sendMessage({ embeds: [embed] });
    }
};
