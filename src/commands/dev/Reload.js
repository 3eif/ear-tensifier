const Command = require('../../structures/Command');

module.exports = class Reload extends Command {
    constructor(client) {
        super(client, {
            name: 'reload',
            description: {
                content: 'Reloads all commands across all clusters.',
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
        function funcName(c, { arg }) {
            c.logger.log(arg);
        }

        client.shard.broadcastEval(funcName, { context: { arg: 'arg' } });

        // client.shard.broadcastEval(c => {
        //     try {
        //         if (!args[1]) return ctx.sendMessage('Please provide a command.');

        //         const commandName = args[1].toLowerCase();
        //         const categoryName = args[0].toLowerCase();
        //         const command = c.commands.get(commandName) || c.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

        //         if (!command) {
        //             return ctx.sendMessage('I could not find that command.');
        //         }

        //         const commandFileName = command.name.charAt(0).toUpperCase() + command.name.slice(1);
        //         delete require.cache[require.resolve(`../${categoryName}/${commandFileName}.js`)];
        //         c.commands.delete(command.name);

        //         const newFile = require(`../${categoryName}/${commandFileName}.js`);
        //         const newCommand = new newFile(this, newFile);
        //         c.commands.set(newCommand.name, newCommand);
        //         if (newCommand.aliases && Array.isArray(newCommand.aliases)) {
        //             for (const alias of newCommand.aliases) {
        //                 c.aliases.set(alias, newCommand);
        //             }
        //         }

        //         ctx.sendMessage(`Reloaded the **${commandName}** command.`);
        //     }
        //     catch (error) {
        //         c.logger.error(error);
        //         return ctx.sendMessage(`An error occurred while reloading the command:\n\`\`\`${error.message}\`\`\``);
        //     }
        // });
    }
};