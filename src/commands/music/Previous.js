const { EmbedBuilder } = require('discord.js');

const Command = require('../../structures/Command');

module.exports = class Previous extends Command {
    constructor(client) {
        super(client, {
            name: 'previous',
            description: {
                content: 'Plays the previous song.',
            },
            aliases: ['back'],
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
        if (!player.queue.previous) return ctx.sendMessage('There is no previous song.');
        player.queue.unshift(player.queue.previous);
        player.skip();

        const embed = new EmbedBuilder()
            .setColor(client.config.colors.default)
            .setAuthor({ name: `Backing up to ${player.queue.current.title}`, iconURL: ctx.author.displayAvatarURL() });
        return ctx.sendMessage({ embeds: [embed] });
    }
};
