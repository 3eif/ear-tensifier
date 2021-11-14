const { MessageEmbed } = require('discord.js');

const Command = require('../../structures/Command');
const Server = require('../../models/Server');

module.exports = class Prefix extends Command {
    constructor(client) {
        super(client, {
            name: 'prefix',
            description: {
                content: 'Set the prefix for the server',
                usage: '<prefix>',
                examples: ['ear_', '!'],
            },
            aliases: ['setprefix'],
            permissions: {
                userPermissions: ['MANAGE_MESSAGES'],
            },
        });
    }
    async run(client, ctx, args) {
        if (!args[0]) {
            Server.findById(ctx.guild.id, async (err, s) => {
                if (err) client.logger.error(err);
                return ctx.sendMessage(`The current prefix is \`${s.prefix}\``);
            });
        }

        if (!args[0]) return;

        const f = args[0].replace(/_/g, ' ');
        await ctx.sendDeferMessage(`${client.config.emojis.typing} Setting prefix to ${f}...`);

        Server.findById(ctx.guild.id, async (err, s) => {
            if (err) client.logger.error(err);
            await s.updateOne({ prefix: f }).catch(e => client.logger.error(e));

            const embed = new MessageEmbed()
                .setAuthor(`${ctx.guild.name}`, ctx.guild.iconURL())
                .setColor(client.config.colors.default)
                .setDescription(`Successfully set the prefix to \`${f}\``)
                .setFooter('Tip: to add a space to your prefix, add: _');
            ctx.editMessage({ content: null, embeds: [embed] });
        });
    }
};