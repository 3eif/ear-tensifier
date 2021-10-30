const { SlashCommandBuilder } = require('@discordjs/builders');
const Command = require('../../structures/Command');

module.exports = class Ping extends Command {
    constructor(client) {
        super(client, {
            name: 'ping',
            description: {
                content: 'Ping command',
            },
            enabled: true,
            cooldown: 4,
            args: false,
            options: {},
        });
    }

    async run(client, message) {
        const msg = await message.channel.send(`Pinging...`);
        return msg.edit(`Pong! (Latency: ${msg.createdTimestamp - message.createdTimestamp}ms. API Latency: ${Math.round(client.ws.ping)}ms.)`);
    }

    async execute(client, interaction) {
        await interaction.reply('Pong!');
    }
};
