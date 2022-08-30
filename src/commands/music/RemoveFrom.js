const { ApplicationCommandOptionType } = require('discord.js');
const Command = require('../../structures/Command');

module.exports = class RemoveFrom extends Command {
    constructor(client) {
        super(client, {
            name: 'removefrom',
            description: {
                content: 'Removes a range of songs from the starting position to the ending position.',
                usage: '<song position> <song position 2>',
                examples: ['3 5', '1 5'],
            },
            args: true,
            aliases: ['removef', 'removerange'],
            voiceRequirements: {
                isInVoiceChannel: true,
                isInSameVoiceChannel: true,
                isPlaying: true,
            },
            options: [
                {
                    name: 'position1',
                    type: ApplicationCommandOptionType.String,
                    required: true,
                    description: 'The starting range.',
                    autocomplete: true,
                },
                {
                    name: 'position2',
                    type: ApplicationCommandOptionType.String,
                    required: true,
                    description: 'The ending range.',
                    autocomplete: true,
                },
            ],
            slashCommand: true,
        });
    }

    async autocomplete(client, interaction) {
        const focusedValue = interaction.options.getFocused();
        const queue = client.music.players.get(interaction.guild.id).queue;
        const songs = [];
        for (let i = 0; i < queue.length; i++) {
            songs.push(`${i + 1}. ${queue[i].title} • ${queue[i].author}`);
        }
        const filtered = songs.filter(choice => choice.startsWith(focusedValue));
        if (filtered.length > 25) filtered.length = 25;
        await interaction.respond(filtered.map(choice => ({ name: choice, value: choice })));
    }

    async run(client, ctx, args) {
        const player = client.music.players.get(ctx.guild.id);

        const pos = args[0].replace('.', '').split(' ')[0];
        const pos2 = args[1].replace('.', '').split(' ')[0];

        if (isNaN(pos) || isNaN(pos2)) return ctx.sendMessage('Invalid number.');

        if (pos == 0 || pos2 == 0) return ctx.sendMessage(`Cannot remove a song that is already playing. To skip the song type: \`${await ctx.messageHelper.getPrefix()}skip\``);
        if (pos > player.queue.length || args[1] > player.queue.length) return ctx.sendMessage('Song not found.');
        if (pos > pos2) return ctx.sendMessage('Start amount must be bigger than end.');

        const songsToRemove = pos2 - pos;
        player.queue.splice(pos - 1, songsToRemove + 1);
        return ctx.sendMessage(`Removed **${songsToRemove + 1}** songs from the queue`);
    }
};
