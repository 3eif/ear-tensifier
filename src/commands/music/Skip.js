const { EmbedBuilder } = require('discord.js');

const Command = require('../../structures/Command');

module.exports = class Skip extends Command {
    constructor(client) {
        super(client, {
            name: 'skip',
            description: {
                content: 'Skips the current song.',
            },
            aliases: ['s', 'next'],
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

        const title = player.queue.current.title;
        if (player.trackRepeat) player.setTrackRepeat(false);
        if (player) player.skip();

        const embed = new EmbedBuilder()
            .setColor(client.config.colors.default)
            .setAuthor({ name: `Skipped ${title}`, iconURL: ctx.author.displayAvatarURL() });
        return ctx.sendMessage({ embeds: [embed] });
    }
};
