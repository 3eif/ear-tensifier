const Command = require('../../structures/Command');
const Bot = require('../../models/Bot');

module.exports = class CommandStats extends Command {
    constructor(client) {
        super(client, {
            name: 'commandstats',
            description: {
                content: 'Shows the most used commands.',
            },
            aliases: ['commandsused'],
            permissions: {
                dev: true,
            },
        });
    }
    async run(client, ctx) {
        await ctx.sendDeferMessage(`${client.config.emojis.typing} Fetching most used commands...`);

        Bot.findById(client.user.id, async (err, bot) => {
            if (err) client.logger.error(err);
            const commands = bot.commands.sort((a, b) => b.timesUsed - a.timesUsed);
            const commandsString = [];

            for (let i = 0; i < commands.length; i++) {
                try {
                    commandsString.push(`**${i + 1}.** ${commands[i]._id} (${commands[i].timesUsed.toLocaleString()} uses)`);
                }
                catch (e) {
                    client.logger.error(e);
                    return ctx.editMessage('An error occured.');
                }
            }

            const commandsPerPage = 20;
            const embeds = [];
            for (let i = 0; i < Math.ceil(commands.length / commandsPerPage); i++) {
                embeds.push({
                    title: `Top ${i * commandsPerPage + commandsPerPage} most used commands`,
                    description: commandsString.slice(i * commandsPerPage, i * commandsPerPage + commandsPerPage).join('\n'),
                });
            }

            await ctx.messageHelper.paginate(embeds);
        });
    }
};