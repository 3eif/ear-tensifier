const { EmbedBuilder, ButtonStyle } = require('discord.js');

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
            buttonRow.components[2] = new ButtonStyle()
                .setCustomId('PAUSE_BUTTON')
                .setStyle(ButtonStyle.Secondary)
                .setEmoji(client.config.emojis.pause);
            await player.nowPlayingMessage.edit({ components: [buttonRow] });
        }

        const embed = new EmbedBuilder()
            .setColor(client.config.colors.default)
            .setAuthor({ name: `Song is now ${player.playing ? 'resumed' : 'paused'}.`, iconURL: ctx.author.displayAvatarURL() });
        return ctx.sendMessage({ embeds: [embed] });
    }
};
