const { MessageEmbed } = require('discord.js');

const Command = require('../../structures/Command');

module.exports = class SkipTo extends Command {
    constructor(client) {
        super(client, {
            name: 'skipto',
            description: {
                content: 'Skips to a certain song in the queue',
                usage: '<song position>',
                examples: ['2', '6'],
            },
            args: true,
            voiceRequirements: {
                isInVoiceChannel: true,
                inSameVoiceChannel: true,
                isPlaying: true,
            },
            options: [
                {
                    name: 'position',
                    type: 4,
                    required: true,
                    description: 'The position of the song to skip to.',
                },
            ],
            slashCommand: true,
        });
    }
    async run(client, ctx, args) {
        if (isNaN(args[0])) return ctx.sendMessage('Invalid number.');
        if (args[0] === 0) return ctx.sendMessage(`Cannot skip to a song that is already playing. To skip the current playing song type: \`${client.settings.prefix}skip\``);

        const player = client.music.players.get(ctx.guild.id);
        if ((args[0] > player.queue.length) || (args[0] && !player.queue[args[0] - 1])) return ctx.sendMessage('Song not found.');
        if (args[0] == 1) player.skip();
        else {
            player.queue.splice(0, args[0] - 1);
            player.skip();
        }

        const embed = new MessageEmbed()
            .setColor(client.config.colors.default)
            .setDescription(`Skipped to **${player.queue.current.title}**`);
        return ctx.sendMessage({ embeds: [embed] });
    }
};