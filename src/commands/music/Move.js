const { ApplicationCommandOptionType } = require('discord-api-types');

const Command = require('../../structures/Command');

module.exports = class Move extends Command {
    constructor(client) {
        super(client, {
            name: 'move',
            description: {
                content: 'Moves a song to another location in the queue.',
                usage: '<old position> [new position]',
                examples: ['1 2', '1'],
            },
            args: true,
            voiceRequirements: {
                isInVoiceChannel: true,
                isInSameVoiceChannel: true,
                isPlaying: true,
            },
            options: [
                {
                    name: 'old',
                    type: ApplicationCommandOptionType.Integer,
                    required: true,
                    description: 'The old position of the song (moves the song to position 1 if no new position is provided).',
                },
                {
                    name: 'new',
                    type: ApplicationCommandOptionType.Integer,
                    required: false,
                    description: 'The new position of the song.',
                },
            ],
            slashCommand: true,
        });
    }
    async run(client, ctx, args) {
        if (isNaN(args[0])) return ctx.sendMessage('Invalid number.');
        if (args[0] === 0) return ctx.sendMessage(`Cannot move a song that is already playing. To skip the current playing song type: \`${await ctx.messageHelper.getPrefix()}skip\``);

        const player = client.music.players.get(ctx.guild.id);
        if ((args[0] > player.queue.length) || (args[0] && !player.queue[args[0] - 1])) return ctx.sendMessage('Song not found.');

        if (!args[1]) {
            const song = player.queue[args[0] - 1];
            player.queue.splice(args[0] - 1, 1);
            player.queue.splice(0, 0, song);
            return ctx.sendMessage(`Moved **${song.title}** to the beginning of the queue.`);
        }
        else if (args[1]) {
            if (args[1] == 0) return ctx.sendMessage(`Cannot move a song that is already playing. To skip the current playing song type: \`${await ctx.messageHelper.getPrefix()}skip\``);
            if ((args[1] > player.queue.length) || !player.queue[args[1] - 1]) return ctx.sendMessage('Song not found.');
            const song = player.queue[args[0] - 1];
            player.queue.splice(args[0] - 1, 1);
            player.queue.splice(args[1] - 1, 0, song);
            return ctx.sendMessage(`Moved **${song.title}** to the position ${args[1]}.`);
        }
    }
};