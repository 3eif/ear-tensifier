const { ApplicationCommandOptionType } = require('discord.js');
const { EmbedBuilder } = require('discord.js');

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
                    type: ApplicationCommandOptionType.String,
                    required: true,
                    description: 'The position of the song to skip to.',
                    autocomplete: true,
                },
            ],
            slashCommand: true,
        });
    }
    async run(client, ctx, args) {
        const pos = args[0].replace('.', '').split(' ')[0];

        if (isNaN(pos)) return ctx.sendMessage('Invalid number.');
        if (pos === 0) return ctx.sendMessage(`Cannot skip to a song that is already playing. To skip the current playing song type: \`${client.settings.prefix}skip\``);

        const player = client.music.players.get(ctx.guild.id);
        if ((pos > player.queue.length) || (pos && !player.queue[pos - 1])) return ctx.sendMessage('Song not found.');
        if (pos == 1) player.skip();
        else {
            player.queue.splice(0, pos - 1);
            player.skip();
        }

        const embed = new EmbedBuilder()
            .setColor(client.config.colors.default)
            .setDescription(`Skipped to **${player.queue.current.title}**`);
        return ctx.sendMessage({ embeds: [embed] });
    }
};