const { EmbedBuilder } = require('discord.js');

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

        if (!player.paused) return ctx.sendMessage('Song is already resumed.');
        player.pause(false);

        const embed = new EmbedBuilder()
            .setColor(client.config.colors.default)
            .setAuthor(`Song is now ${player.playing ? 'resumed' : 'paused'}.`, ctx.author.displayAvatarURL());
        return ctx.sendMessage({ embeds: [embed] });
    }
};
