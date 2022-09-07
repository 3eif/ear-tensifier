const { EmbedBuilder, ButtonStyle, ButtonBuilder } = require('discord.js');

const Command = require('../../structures/Command');

module.exports = class Resume extends Command {
    constructor(client) {
        super(client, {
            name: 'resume',
            description: {
                content: 'Resumes the current song.',
            },
            args: false,
            voiceRequirements: {
                isInVoiceChannel: true,
                isInSameVoiceChannel: true,
                isPlaying: true,
            },
            slashCommand: true,
        });
    }

    async run(client, ctx) {
        const player = client.music.players.get(ctx.guild.id);

        if (!player.paused) return ctx.sendEphemeralMessage('Song is already resumed.');
        player.pause(false);

        if (player.nowPlayingMessage) {
            const buttonRow = player.nowPlayingMessage.components[0];
            buttonRow.components[2] = new ButtonBuilder()
                .setCustomId('PAUSE_BUTTON')
                .setStyle(ButtonStyle.Primary)
                .setEmoji(client.config.emojis.pause);
            await player.nowPlayingMessage.edit({ embeds: [player.nowPlayingMessage.embeds[0]], components: [buttonRow] });
        }

        const embed = new EmbedBuilder()
            .setColor(client.config.colors.default)
            .setAuthor({ name: `Song is now ${player.playing ? 'resumed' : 'paused'}.`, iconURL: ctx.author.displayAvatarURL() });
        return ctx.sendMessage({ embeds: [embed] });
    }
};
