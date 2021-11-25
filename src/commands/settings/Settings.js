const { MessageEmbed } = require('discord.js');

const Command = require('../../structures/Command');
const Server = require('../../models/Server');

module.exports = class Settings extends Command {
    constructor(client) {
        super(client, {
            name: 'settings',
            description: {
                content: 'Sends an embed which contains information about ignored channels, default values, and enabled/disabled features.',
            },
            aliases: ['config', 'ignoredchannels', 'defaults'],
            args: false,
            slashCommand: true,
        });
    }
    async run(client, ctx) {
        await ctx.sendDeferMessage(`${client.config.emojis.typing} Fetching server settings...`);

        const server = await Server.findById(ctx.guild.id);

        const embed = new MessageEmbed()
            .setColor(client.config.colors.default)
            .setTitle(`Settings - ${ctx.guild.name}`)
            .setThumbnail(ctx.guild.iconURL())
            .addField('Prefix', server.prefix)
            .addField('Default Volume', server.defaults.volume.toLocaleString())
            .addField('Now Playing Messages', server.nowPlayingMessages ? 'Enabled' : 'Disabled')
            .addField('Ignored Channels', `\n${server.ignoredChannels.length ? server.ignoredChannels.map(channel => `<#${channel}>`).join(', ') : 'None'}`)
            .setTimestamp();
        ctx.editMessage({ content: null, embeds: [embed] });
    }
};