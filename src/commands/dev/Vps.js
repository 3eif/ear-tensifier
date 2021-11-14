const Command = require('../../structures/Command');

const { MessageEmbed } = require('discord.js');
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

        const statsEmbed = new MessageEmbed()
            .setAuthor('VPS')
            .setColor(client.config.colors.default)
            .addField('Host', `${os.type()} ${os.release()} (${os.arch()})`)
            .addField('CPU', `${os.cpus()[0].model}`)
            .addField('Uptime', `${days} days, ${hours} hours, ${mins} minutes, and ${realTotalSecs} seconds`)
            .addField('RAM', `${(os.totalmem() / 1024 / 1024 / 1024).toFixed(2)} GB`)
            .addField('Memory Usage', `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`)
            .addField('CPU Load', `${(os.loadavg()[0] * 100).toFixed(2)}%`)
            .addField('CPU Cores', `${os.cpus().length}`)
            .setFooter('Node Version: ${process.version}')
            .setTimestamp();
        return ctx.sendMessage({ content: null, embeds: [statsEmbed] });
    }
};