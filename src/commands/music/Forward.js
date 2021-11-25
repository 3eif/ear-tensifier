const Command = require('../../structures/Command');
const formatDuration = require('../../utils/music/formatDuration');

module.exports = class Foward extends Command {
    constructor(client) {
        super(client, {
            name: 'forward',
            description: {
                content: 'Fast forwards a song (default: 10 seconds).',
                usage: '[seconds]',
            },
            aliases: ['ff', 'fastfoward'],
            voiceRequirements: {
                isInVoiceChannel: true,
                isInSameVoiceChannel: true,
                isPlaying: true,
            },
            options: [
                {
                    name: 'seconds',
                    type: 4,
                    required: true,
                    description: 'The amount of seconds to skip.',
                },
            ],
            slashCommand: true,
        });
    }

    async run(client, ctx, args) {
        const player = client.music.players.get(ctx.guild.id);
        const fastForwardNum = 10;

        if (args[0] && !isNaN(args[0])) {
            if ((player.getTime() + args[0]) < player.queue.current.duration) {
                player.seek(player.getTime() + args[0]);
                const parsedDuration = formatDuration(player.getTime());
                return ctx.sendMessage(`Fast-forwarded to ${parsedDuration}`);
            }
            else { return ctx.sendMessage('Cannot forward beyond the song\'s duration.'); }
        }
        else if (args[0] && isNaN(args[0])) { return ctx.sendMessage(`Invalid argument, must be a number.\nCorrect Usage: \`${await ctx.messageHelper.getPrefixx()}forward <seconds>\``); }

        if (!args[0]) {
            if ((player.getTime() + fastForwardNum) < player.queue.current.duration) {
                player.seek(player.getTime() + fastForwardNum);
                const parsedDuration = formatDuration(player.getTime());
                return ctx.sendMessage(`Fast-forwarded to ${parsedDuration}`);
            }
            else {
                return ctx.sendMessage('Cannot forward beyond the song\'s duration.');
            }
        }
    }
};
