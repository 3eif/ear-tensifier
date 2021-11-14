const { MessageEmbed } = require('discord.js');

const Command = require('../../structures/Command');
const Server = require('../../models/Server');

module.exports = class Listen extends Command {
    constructor(client) {
        super(client, {
            name: 'listen',
            description: {
                content: 'The bot will resume responding to commands from a specific channel.',
                usage: '<channel>',
                examples: ['#general'],
            },
            args: true,
            permissions: {
                userPermissions: ['MANAGE_CHANNELS'],
            },
        });
    }
    async run(client, ctx, args) {
        await ctx.sendDeferMessage(`${client.config.emojis.typing} Listening to commands from channel...`);

        let channel;
        if (ctx.ctx.mentions.channels.first() === undefined) {
            if (!isNaN(args[0])) channel = args[0];
            else return ctx.sendDeferMessage('No channel found.');
        }
        else {
            channel = ctx.ctx.mentions.channels.first().id;
        }

        Server.findById(ctx.guild.id, async (err, s) => {
            if (err) client.logger.error(err);
            if (s.ignoredChannels.includes(channel)) {
                for (let i = 0; i < s.ignoredChannels.length; i++) {
                    if (s.ignoredChannels[i] === channel) {
                        s.ignoredChannels.splice(i, 1);
                        await s.updateOne({ ignoredChannels: s.ignoredChannels }).catch(e => client.log(e));
                        break;
                    }
                }
            }
            else return ctx.editMessage('This channel is not being ignored!');

            const embed = new MessageEmbed()
                .setAuthor(`${ctx.guild.name}`, ctx.guild.iconURL())
                .setColor(client.config.colors.default)
                .setDescription(`I will now listen to commands from ${args[0]}.`);
            ctx.editMessage({ content: ' ', embeds: [embed] });
        });
    }
};