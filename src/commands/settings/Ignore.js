const { MessageEmbed } = require('discord.js');

const Command = require('../../structures/Command');
const Server = require('../../models/Server');

module.exports = class Ignore extends Command {
    constructor(client) {
        super(client, {
            name: 'ignore',
            description: {
                content: 'The bot will stop responding to commands from a specific channel.',
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
        await ctx.sendDeferMessage(`${client.config.emojis.typing} Ignoring commands from channel...`);

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
            if (s.ignoredChannels.includes(channel)) return ctx.editMessage('I am already ignoring this channel!');
            s.ignoredChannels.push(channel);
            await s.updateOne({ ignoredChannels: s.ignoredChannels }).catch(e => client.logger.error(e));

            const embed = new MessageEmbed()
                .setAuthor(`${ctx.guild.name}`, ctx.guild.iconURL())
                .setColor(client.config.colors.default)
                .setDescription(`I will now ignore commands from ${args[0]}.`)
                .setFooter(`Tip: You can make me listen to commands again by doing ${await ctx.messageHelper.getPrefix()}listen`);
            ctx.editMessage({ content: ' ', embeds: [embed] });
        });
    }
};