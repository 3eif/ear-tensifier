const { MessageEmbed } = require('discord.js');

const Command = require('../../structures/Command');
const Server = require('../../models/Server');

module.exports = class ListenOnly extends Command {
    constructor(client) {
        super(client, {
            name: 'listenonly',
            description: {
                content: 'The bot will only listen to commands from one channel..',
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
        let channel;
        if (ctx.ctx.mentions.channels.first() === undefined) {
            if (!isNaN(args[0])) channel = args[0];
            else return ctx.sendDeferMessage('No channel found.');
        }
        else {
            channel = ctx.ctx.mentions.channels.first().id;
        }

        await ctx.sendDeferMessage(`${client.config.emojis.typing} Ignoring commands from all channels except ${args[0]}...`);

        Server.findById(ctx.guild.id, async (err, s) => {
            if (err) client.logger.error(err);

            const channelsToIgnore = [];
            ctx.guild.channels.cache.filter(c => c.type === 'GUILD_TEXT').each(c => {
                if (c.id !== channel) channelsToIgnore.push(c.id);
            });
            await s.updateOne({ ignoredChannels: channelsToIgnore }).catch(e => client.logger.error(e));

            const embed = new MessageEmbed()
                .setAuthor(`${ctx.guild.name}`, ctx.guild.iconURL())
                .setColor(client.config.colors.default)
                .setDescription(`I will now only listen to commands from ${args[0]}.`)
                .setFooter(`Tip: You can make me listen to commands in all channels again by doing ${await ctx.messageHelper.getPrefix()}listenall`);
            ctx.editMessage({ content: null, embeds: [embed] });
        });
    }
};