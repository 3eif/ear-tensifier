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
            aliases: ['rm'],
            voiceRequirements: {
                isInVoiceChannel: true,
                isInSameVoiceChannel: true,
                isPlaying: true,
            },
            options: [
                {
                    name: 'position',
                    type: ApplicationCommandOptionType.String,
                    required: true,
                    description: 'The position of the song to remove.',
                    autocomplete: true,
                },
            ],
            slashCommand: true,
        });
    }
    async run(client, ctx, args) {
        const player = client.music.players.get(ctx.guild.id);

        const pos = args[0].replace('.', '').split(' ')[0];

        if (isNaN(pos)) return ctx.sendMessage('Invalid number.');

        if (pos == 0) return ctx.sendMessage(`Cannot remove a song that is already playing. To skip the song type: \`${await ctx.messageHelper.getPrefix()}skip\``);
        if (pos > player.queue.length) return ctx.sendMessage('Song not found.');

        const { title } = player.queue[pos - 1];

        player.queue.splice(pos - 1, 1);
        return ctx.sendMessage(`Removed **${title}** from the queue`);
    }
};
