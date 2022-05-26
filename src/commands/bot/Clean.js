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
        if (ctx.guild.id == '441290611904086016') return;

        let messagesToDelete = parseInt(args[0]) || 100;
        if (args[0]) {
            if (isNaN(messagesToDelete) || messagesToDelete < 1 || messagesToDelete > 100) {
                return ctx.sendMessage({ content: `Invalid argument, argument must be a number.\nCorrect Usage: \`${await ctx.messageHelper.getPrefix()}clean <number messages>\`` });
            }
        }
        if (ctx.channel.type == 'GUILD_TEXT') {
            await ctx.channel.messages.fetch({ limit: messagesToDelete }).then(messages => {
                let botMessages = messages.filter(msg => msg.author.id == client.user.id);
                ctx.channel.bulkDelete(botMessages).catch(console.error);
            }).catch(err => {
                client.logger.error(err);
            });
        }
    }
};
