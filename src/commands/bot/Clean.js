const { ApplicationCommandOptionType, PermissionsBitField, ChannelType } = require('discord.js');
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
                userPermissions: [PermissionsBitField.Flags.ManageMessages],
                botPermissions: [PermissionsBitField.Flags.ManageMessages],
            },
            options: [
                {
                    name: 'messages',
                    type: ApplicationCommandOptionType.Integer,
                    required: false,
                    description: 'The number of messages to clean up.',
                    min_value: 0,
                },
            ],
        });
    }

    async run(client, ctx, args) {
        let messagesToDelete = 0;

        if (args[0]) {
            messagesToDelete = parseInt(args[0]);
            if (isNaN(messagesToDelete) || messagesToDelete < this.options[0].min_value) {
                return ctx.sendMessage({ content: 'Invalid argument, argument must be a number.\nCorrect Usage: `/clean <number messages>`' });
            }
        }

        let deletedMessages = 0;
        if (ctx.channel.type === ChannelType.GuildText) {
            await ctx.channel.messages.fetch({ limit: 100 }).then(messages => {
                let botMessages = messages.filter(msg => msg.author == client.user.id);
                if (args[0]) {
                    botMessages = messages.filter(msg => msg.author == client.user.id);
                    botMessages.forEach(msg => {
                        if (messagesToDelete > deletedMessages) {
                            msg.delete();
                            deletedMessages++;
                        }
                    });
                    ctx.sendMessage(`Cleaned ${deletedMessages} bot messages.`);
                }
                else {
                    ctx.channel.bulkDelete(botMessages);
                    ctx.sendMessage(`Cleaned ${botMessages.size} bot messages.`);
                }
            }).catch(err => {
                client.logger.error(err);
            });

        }
    }
};
