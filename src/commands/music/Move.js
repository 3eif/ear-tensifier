const { ApplicationCommandOptionType } = require('discord.js');

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
                    type: ApplicationCommandOptionType.String,
                    required: true,
                    description: 'The old position of the song (moves the song to position 1 if no new position is provided).',
                    autocomplete: true,
                },
                {
                    name: 'new',
                    type: ApplicationCommandOptionType.String,
                    required: false,
                    description: 'The new position of the song.',
                    autocomplete: true,
                },
            ],
            slashCommand: true,
        });
    }
    async run(client, ctx, args) {
        const pos = args[0].replace('.', '').split(' ')[0];

        if (isNaN(pos)) return ctx.sendMessage('Invalid number.');
        if (pos === 0) return ctx.sendMessage('Cannot move a song that is already playing. To skip the current playing song type: `/skip`');

        const player = client.music.players.get(ctx.guild.id);
        if ((pos > player.queue.length) || (pos && !player.queue[pos - 1])) return ctx.sendMessage('Song not found.');

        if (!args[1]) {
            const song = player.queue[pos - 1];
            player.queue.splice(pos - 1, 1);
            player.queue.splice(0, 0, song);
            return ctx.sendMessage(`Moved **${song.title}** to the beginning of the queue.`);
        }
        else if (args[1]) {
            const pos2 = args[1].replace('.', '').split(' ')[0];

            if (pos2 == 0) return ctx.sendMessage('Cannot move a song that is already playing. To skip the current playing song type: `/skip`');
            if ((pos2 > player.queue.length) || !player.queue[pos2 - 1]) return ctx.sendMessage('Song not found.');
            const song = player.queue[pos - 1];
            player.queue.splice(pos - 1, 1);
            player.queue.splice(pos2 - 1, 0, song);
            return ctx.sendMessage(`Moved **${song.title}** to position ${pos2}.`);
        }
    }
};