const { MessageEmbed } = require('discord.js');

const Command = require('../../structures/Command');
const Song = require('../../models/Song');

module.exports = class Charts extends Command {
    constructor(client) {
        super(client, {
            name: 'charts',
            description: {
                content: 'Shows the most played songs.',
            },
            aliases: ['top', 'chart', 'topcharts', 'topchart'],
            args: false,
            slashCommand: false,
        });
    }

    async run(client, ctx) {
        await ctx.sendDeferMessage(`${client.config.emojis.typing} Fetching most played songs...`);

        Song.find().sort([['timesPlayed', 'descending']]).exec(async (err, res) => {
            if (err) client.log(err);
            const songsArr = [];

            if (res.length < 10) return ctx.editMessage('More songs must be aggregated in order for this command to function.');

            for (let i = 0; i < 10; i++) {
                try {
                    songsArr.push(`**${i + 1}.** **[${res[i].title}](${res[i]._id})** (${res[i].timesPlayed.toLocaleString()} plays)`);
                }
                catch (e) {
                    client.logger.error(e);
                    return ctx.editMessage('An error occured.');
                }
            }

            const embed = new MessageEmbed()
                .setAuthor('Top Charts', client.user.displayAvatarURL())
                .addField('Top Songs', `${songsArr.join('\n')}`)
                .setTimestamp()
                .setColor(client.config.colors.default);
            return ctx.editMessage({ content: null, embeds: [embed] });
        });
    }
};
