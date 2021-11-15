const { MessageEmbed } = require('discord.js');

const Command = require('../../structures/Command');
const Server = require('../../models/Server');

module.exports = class ListenAll extends Command {
    constructor(client) {
        super(client, {
            name: 'listenall',
            description: {
                content: 'The bot will listen to commands from all channels..',
            },
            permissions: {
                userPermissions: ['MANAGE_CHANNELS'],
            },
        });
    }
    async run(client, ctx, args) {
        await ctx.sendDeferMessage(`${client.config.emojis.typing} Listening to commands from all channels ${args[0]}...`);

        Server.findById(ctx.guild.id, async (err, s) => {
            if (err) client.logger.error(err);
            await s.updateOne({ ignoredChannels: [] }).catch(e => client.logger.error(e));

            const embed = new MessageEmbed()
                .setAuthor(`${ctx.guild.name}`, ctx.guild.iconURL())
                .setColor(client.config.colors.default)
                .setDescription('I will now listen to commands from all channels.');
            ctx.editMessage({ content: null, embeds: [embed] });
        });
    }
};