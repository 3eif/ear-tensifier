const { ApplicationCommandOptionType } = require('discord.js');
const Command = require('../../structures/Command');

module.exports = class Remove extends Command {
    constructor(client) {
        super(client, {
            name: 'remove',
            description: {
                content: 'Removes a song from the queue',
                usage: '<song position> [song position 2]',
                examples: ['1', '1 5'],
            },
            args: true,
            aliases: ['removefrom', 'removerange'],
            voiceRequirements: {
                isInVoiceChannel: true,
                isInSameVoiceChannel: true,
                isPlaying: true,
            },
            options: [
                {
                    name: 'position',
                    type: ApplicationCommandOptionType.Integer,
                    required: true,
                    description: 'The position of the song to remove.',
                },
                {
                    name: 'position2',
                    type: ApplicationCommandOptionType.Integer,
                    required: false,
                    description: 'The range of songs to remove between the first and second position.',
                },
            ],
            slashCommand: true,
        });
    }
    async run(client, ctx, args) {
        const player = client.music.players.get(ctx.guild.id);

        if (isNaN(args[0])) return ctx.sendMessage('Invalid number.');

        if (!args[1]) {
            if (args[0] == 0) return ctx.sendMessage(`Cannot remove a song that is already playing. To skip the song type: \`${await ctx.messageHelper.getPrefix()}skip\``);
            if (args[0] > player.queue.length) return ctx.sendMessage('Song not found.');

            const { title } = player.queue[args[0] - 1];

            player.queue.splice(args[0] - 1, 1);
            return ctx.sendMessage(`Removed **${title}** from the queue`);
        }
        else {
            if (args[0] == 0 || args[1] == 0) return ctx.sendMessage(`Cannot remove a song that is already playing. To skip the song type: \`${await ctx.messageHelper.getPrefix()}skip\``);
            if (args[0] > player.queue.length || args[1] > player.queue.length) return ctx.sendMessage('Song not found.');
            if (args[0] > args[1]) return ctx.sendMessage('Start amount must be bigger than end.');

            const songsToRemove = args[1] - args[0];
            player.queue.splice(args[0] - 1, songsToRemove + 1);
            return ctx.sendMessage(`Removed **${songsToRemove + 1}** songs from the queue`);
        }
    }
};
