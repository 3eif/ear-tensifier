const Command = require('../../structures/Command');

module.exports = class Reload extends Command {
    constructor(client) {
        super(client, {
            name: 'reload',
            description: {
                content: 'Reloads all commands across all shards.',
                usage: '<category> <command>',
                examples: ['bot ping', 'music play'],
            },
            args: true,
            permissions: {
                dev: true,
            },
        });
    }
    async run(client, ctx, args) {
        if (!args[1]) return ctx.sendMessage('Please provide a command.');

        const commandName = args[1];
        const categoryName = args[0].toLowerCase();
        const command = client.commands.get(commandName.toLowerCase()) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName.toLowerCase()));

        if (!command) return ctx.sendMessage('I could not find that command.');

        try {
            client.shard.broadcastEval(client.reloadCommand, { context: { categoryName: categoryName, commandName: commandName } });
            return ctx.sendMessage(`Reloaded the **${commandName.toLowerCase()}** command.`);
        }
        catch (e) {
            return ctx.sendMessage(`An error occurred while reloading the command:\n\`\`\`${e.message}\`\`\``);
        }
    }
};