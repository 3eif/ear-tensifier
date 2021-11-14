const { MessageEmbed } = require('discord.js');

const Command = require('../../structures/Command');
const formatDuration = require('../../utils/music/formatDuration');

module.exports = class Queue extends Command {
    constructor(client) {
        super(client, {
            name: 'queue',
            description: {
                content: 'Displays the queue.',
            },
            args: false,
            voiceRequirements: {
                isPlaying: true,
            },
            options: [{
                name: 'page',
                type: 4,
                required: false,
                description: 'View a certain page of the queue.',
            }],
            slashCommand: true,
        });
    }

    async run(client, ctx, args) {
        const player = client.music.players.get(ctx.guild.id);

        if (!player.queue.current) return ctx.sendMessage('There is nothing currently playing.');

        const { title, requester, duration, url } = player.queue.current;

        const parsedDuration = formatDuration(duration);
        const parsedQueueDuration = formatDuration(player.queue.reduce((acc, cur) => acc + cur.duration, 0));

        let pagesNum = Math.ceil(player.queue.length / 10);
        if (pagesNum === 0) pagesNum = 1;

        const songStrings = [];
        for (let i = 0; i < player.queue.length; i++) {
            const song = player.queue[i];
            songStrings.push(`**${i + 1}.** [${song.title}](${song.url}) \`[${formatDuration(song.duration)}]\` • <@${song.requester.id}>\n`);
        }

        const user = `<@${requester.id}>`;
        const pages = [];
        for (let i = 0; i < pagesNum; i++) {
            const str = songStrings.slice(i * 10, i * 10 + 10).join('');
            const embed = new MessageEmbed()
                .setAuthor(`Queue - ${ctx.guild.name}`, ctx.guild.iconURL())
                .setColor(client.config.colors.default)
                .setDescription(`**Now Playing**: [${title}](${url}}) \`[${parsedDuration}]\` • ${user}.\n\n**Up Next**:${str == '' ? '  Nothing' : `\n${str}`}`)
                .setFooter(`Page ${i + 1}/${pagesNum} | ${player.queue.length} song(s) | ${parsedQueueDuration} total duration`);
            pages.push(embed);
        }

        if (!args[0]) {
            if (pages.length == pagesNum && player.queue.length > 10) await ctx.messageHelper.paginate(pages);
            else return ctx.sendMessage({ embeds: [pages[0]] });
        }
        else {
            if (isNaN(args[0])) return ctx.sendMessage('Page must be a number.');
            if (args[0] > pagesNum) return ctx.sendMessage(`There are only ${pagesNum} pages available.`);
            const pageNum = args[0] == 0 ? 1 : args[0] - 1;
            return ctx.sendMessage({ embeds: [pages[pageNum]] });
        }
    }
};
