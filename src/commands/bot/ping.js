const Command = require('../../structures/Command');

module.exports = class Ping extends Command {
    constructor(client) {
        super(client, {
            name: 'ping',
            description: {
                content: 'Displays the bot\'s latency.',
            },
            aliases: ['latency'],
            args: false,
        });
    }

    async run(client, message) {
        const msg = await message.channel.send(`${client.config.emojis.loading} Pinging...`);
        return msg.edit(`Pong! (Latency: ${msg.createdTimestamp - message.createdTimestamp}ms. API Latency: ${Math.round(client.ws.ping)}ms.)`);
    }

    async execute(client, interaction) {
        await interaction.reply(`${client.config.emojis.loading} Pinging...`);
        await interaction.editReply(`Pong! (Latency: ${interaction.createdAt - interaction.createdTimestamp}ms. API Latency: ${Math.round(client.ws.ping)}ms.)`);
    }
};
