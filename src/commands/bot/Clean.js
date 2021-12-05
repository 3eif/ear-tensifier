const Command = require('../../structures/Command');

module.exports = class Clean extends Command {
    constructor(client) {
        super(client, {
            name: 'clean',
            description: {
                content: 'Bulk deletes an X amount of messages sent by the bot (deletes the last 100 messages by default).',
                usage: '<number of messages>',
                examples: ['10'],
            },
            aliases: ['purge'],
            args: false,
            slashCommand: true,
            permissions: {
                userPermissions: ['MANAGE_MESSAGES'],
                botPermissions: ['MANAGE_MESSAGES'],
            },
            options: [
                {
                    name: 'messages',
                    type: 4,
                    required: true,
                    description: 'The amount of messages to clean up.',
                },
            ],
        });
    }

    async run(client, ctx, args) {
        let messagesToDelete = 0;

        if (args[0]) {
            messagesToDelete = parseInt(args[0]);
            if (isNaN(messagesToDelete) || messagesToDelete < 1) {
                return ctx.sendMessage({ content: `Invalid argument, argument must be a number.\nCorrect Usage: \`${await ctx.messageHelper.getPrefix()}clean <number messages>\`` });
            }
        }

        if (ctx.channel.type == 'GUILD_TEXT') {
            await ctx.channel.messages.fetch({ limit: 100 }).then(messages => {
                let botMessages = messages.filter(msg => msg.author == client.user.id);
                if (messagesToDelete > 0) {
                    botMessages = messages.filter(msg => msg.author == client.user.id);
                    botMessages.forEach(msg => {
                        messagesToDelete--;
                        if (messagesToDelete > 0) {
                            msg.delete();
                        }
                    });
                }
                else ctx.channel.bulkDelete(botMessages);
            }).catch(err => {
                client.logger.error(err);
            });
        }
    }
};
