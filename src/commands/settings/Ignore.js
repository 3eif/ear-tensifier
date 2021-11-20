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
            options: [{
                name: 'channel',
                description: 'Ignores commands coming from the channel you provide.',
                type: 1,
                options: [
                    {
                        name: 'name',
                        type: 7,
                        required: true,
                        description: 'The channel to ignore commands from.',
                    },
                ],
            }],
            slashCommand: true,
        });
    }
    async run(client, ctx, args) {
        let channelId;
        if (ctx.isInteraction) {
            channelId = ctx.interaction.options.data[0].options[0].channel.id;
        }
        else if (ctx.message.mentions.channels.first() === undefined) {
            if (!isNaN(args[0])) channelId = args[0];
            else return ctx.sendDeferMessage('No channel found.');
        }
        else {
            channelId = ctx.message.mentions.channels.first().id;
        }

        await ctx.sendDeferMessage(`${client.config.emojis.typing} Ignoring commands from channel...`);

        Server.findById(ctx.guild.id, async (err, s) => {
            if (err) client.logger.error(err);
            if (s.ignoredChannels.includes(channelId)) return ctx.editMessage('I am already ignoring this channel!');
            s.ignoredChannels.push(channelId);
            await s.updateOne({ ignoredChannels: s.ignoredChannels }).catch(e => client.logger.error(e));

            const embed = new MessageEmbed()
                .setAuthor(`${ctx.guild.name}`, ctx.guild.iconURL())
                .setColor(client.config.colors.default)
                .setDescription(`I will now ignore commands from <#${channelId}>.`)
                .setFooter(`Tip: You can make me listen to commands again by doing ${await ctx.messageHelper.getPrefix()}listen`);
            ctx.editMessage({ content: null, embeds: [embed] });
        });
    }
};