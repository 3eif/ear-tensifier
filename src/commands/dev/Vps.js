const Command = require('../../structures/Command');

const { EmbedBuilder } = require('discord.js');
const os = require('os');

module.exports = class Vps extends Command {
    constructor(client) {
        super(client, {
            name: 'vps',
            description: {
                content: 'Displays the VPS\' info.',
            },
            aliases: ['vpsinfo', 'vpsstats'],
            cooldown: 5,
            args: false,
            permissions: {
                dev: true,
            },
        });
    }
    async run(client, ctx) {
        const totalSeconds = os.uptime();
        const realTotalSecs = Math.floor(totalSeconds % 60);
        const days = Math.floor((totalSeconds % (31536 * 100)) / 86400);
        const hours = Math.floor((totalSeconds / 3600) % 24);
        const mins = Math.floor((totalSeconds / 60) % 60);

        const statsEmbed = new EmbedBuilder()
            .setAuthor('VPS')
            .setColor(client.config.colors.default)
            .addFields(
                { name: 'Host', value: `${os.type()} ${os.release()} (${os.arch()})` },
                { name: 'CPU', value: `${os.cpus()[0].model}` },
                { name: 'Uptime', value: `${days} days, ${hours} hours, ${mins} minutes, and ${realTotalSecs} seconds` },
                { name: 'RAM', value: `${(os.totalmem() / 1024 / 1024 / 1024).toFixed(2)} GB` },
                { name: 'Memory Usage', value: `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB` },
                { name: 'CPU Load', value: `${(os.loadavg()[0]).toFixed(2)}%` },
                { name: 'CPU Cores', value: `${os.cpus().length}` },
            )
            .setFooter(`Node Version: ${process.version}`)
            .setTimestamp();
        return ctx.sendMessage({ content: null, embeds: [statsEmbed] });
    }
};