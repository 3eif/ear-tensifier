const { EmbedBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

const Command = require('../../structures/Command');

module.exports = class Pause extends Command {
    constructor(client) {
        super(client, {
            name: 'pause',
            description: {
                content: 'Pauses the current song.',
            },
            aliases: ['stop'],
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

        if (player.paused) return ctx.sendEphemeralMessage('Song is already paused.');
        player.pause(true);

        if (player.nowPlayingMessage) {
            const buttonRow = player.nowPlayingMessage.components[0];
            buttonRow.components[2] = new ButtonBuilder()
                .setCustomId('PAUSE_BUTTON')
                .setStyle(ButtonStyle.Primary)
                .setEmoji(client.config.emojis.resume);
            await player.nowPlayingMessage.edit({ embeds: [player.nowPlayingMessage.embeds[0]], components: [buttonRow] });
        }

        const embed = new EmbedBuilder()
            .setColor(client.config.colors.default)
            .setAuthor({ name: `Song is now ${player.playing ? 'resumed' : 'paused'}.`, iconURL: ctx.author.displayAvatarURL() });
        return ctx.sendMessage({ embeds: [embed] });
    }
};
