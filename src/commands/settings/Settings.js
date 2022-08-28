const { EmbedBuilder } = require('discord.js');

const Command = require('../../structures/Command');
const Server = require('../../models/Server');

module.exports = class Settings extends Command {
    constructor(client) {
        super(client, {
            name: 'settings',
            description: {
                content: 'Sends an embed which contains the bot\'s server settings.',
            },
            aliases: ['config', 'ignoredchannels', 'defaults'],
            args: false,
            slashCommand: true,
        });
    }
    async run(client, ctx) {
        await ctx.sendDeferMessage(`${client.config.emojis.typing} Fetching server settings...`);

        const server = await Server.findById(ctx.guild.id);

        const embed = new EmbedBuilder()
            .setColor(client.config.colors.default)
            .setTitle(`Settings - ${ctx.guild.name}`)
            .setThumbnail(ctx.guild.iconURL())
            .addFields(
                { name: 'Prefix', value: server.prefix },
                { name: 'Default Volume', value: server.defaults.volume.toLocaleString() },
                { name: 'Now Playing Messages', value: server.nowPlayingMessages ? 'Enabled' : 'Disabled' },
                { name: 'Ignored Channels', value: `\n${server.ignoredChannels.length ? server.ignoredChannels.map(channel => `<#${channel}>`).join(', ') : 'None'}` },
            )
            .setTimestamp();
        ctx.editMessage({ content: null, embeds: [embed] });
    }
};