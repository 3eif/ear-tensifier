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
        if (isNaN(args[0])) return ctx.sendMessage('Invalid number.');
        if (args[0] === 0) return ctx.sendMessage(`Cannot skip to a song that is already playing. To skip the current playing song type: \`${client.settings.prefix}skip\``);

        const player = client.music.players.get(ctx.guild.id);
        if ((args[0] > player.queue.length) || (args[0] && !player.queue[args[0] - 1])) return ctx.sendMessage('Song not found.');
        if (args[0] == 1) player.skip();
        else {
            player.queue.splice(0, args[0] - 1);
            player.skip();
        }

        const embed = new EmbedBuilder()
            .setColor(client.config.colors.default)
            .setDescription(`Skipped to **${player.queue.current.title}**`);
        return ctx.sendMessage({ embeds: [embed] });
    }
};