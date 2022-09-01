const { ApplicationCommandOptionType } = require('discord.js');
const Command = require('../../structures/Command');
const formatDuration = require('../../utils/music/formatDuration');

module.exports = class Seek extends Command {
    constructor(client) {
        super(client, {
            name: 'seek',
            description: {
                content: 'Skips to a timestamp in the song.',
                usage: '<timestamp>',
                examples: ['0:00', '1:00', '2:00'],
            },
            args: true,
            voiceRequirements: {
                isInVoiceChannel: true,
                isInSameVoiceChannel: true,
                isPlaying: true,
            },
            options: [
                {
                    name: 'timestamp',
                    type: ApplicationCommandOptionType.String,
                    required: true,
                    description: 'The timestamp to skip to (format: mm:ss).',
                },
            ],
            slashCommand: true,
        });
    }
    async run(client, ctx, args) {
        if (!args[0].includes(':')) return ctx.sendMessage(`Invalid timestamp. Please provide a timestamp (format: \`mm:ss\`, example: \`1:00\`).\nCorrect Usage: \`${await ctx.messageHelper.getPrefix()}seek <timestamp>\``);

        const seconds = formatDuration(args[0]);
        const player = client.music.players.get(ctx.guild.id);
        if (seconds >= player.queue.current.duration || seconds < 0) return ctx.sendMessage('Cannot seek beyond the length of the song.');
        player.seek(seconds);

        const parsedDuration = formatDuration(player.getTime());
        return ctx.sendMessage(`Seeked to ${parsedDuration ? parsedDuration : args[0]}`);
    }
};