const { MessageEmbed } = require('discord.js');

const Command = require('../../structures/Command');
const QueueHelper = require('../../structures/QueueHelper');
const formatDuration = require('../../utils/music/formatDuration');
const paginate = require('../../utils/misc/paginate');

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
            options: {
                name: 'page',
                value: 'page',
                type: 4,
                required: false,
                description: 'View a certain page of the queue.',
            },
            slashCommand: true,
        });
    }

    async run(client, message, args) {
        let player = client.music.players.get(message.guild.id);
        if (!player) {
            player = client.music.newPlayer(message.guild, message.member.voice.channel, message.channel);
            player.connect();
        }

        const { title, requester, duration, id } = player.queue.current;

        const parsedDuration = formatDuration(duration);
        const parsedQueueDuration = formatDuration(player.queue.reduce((acc, cur) => acc + cur.duration, 0));

        let pagesNum = Math.ceil(player.queue.length / 10);
        if (pagesNum === 0) pagesNum = 1;

        const songStrings = [];
        for (let i = 0; i < player.queue.length; i++) {
            const song = player.queue[i];
            songStrings.push(`**${i + 1}.** [${song.title}](${client.config.urls.youtube + song.id}) \`[${formatDuration(song.duration)}]\` • <@${song.requester.id}>\n`);
        }

        const user = `<@${requester.id}>`;
        const pages = [];
        for (let i = 0; i < pagesNum; i++) {
            const str = songStrings.slice(i * 10, i * 10 + 10).join('');
            const embed = new MessageEmbed()
                .setAuthor(`Queue - ${message.guild.name}`, message.guild.iconURL())
                .setColor(client.config.colors.default)
                .setDescription(`**Now Playing**: [${title}](${client.config.urls.youtube + id}}) \`[${parsedDuration}]\` • ${user}.\n\n**Up Next**:${str == '' ? '  Nothing' : `\n${str}`}`)
                .setFooter(`Page ${i + 1}/${pagesNum} | ${player.queue.length} song(s) | ${parsedQueueDuration} total duration`);
            pages.push(embed);
        }

        if (!args[0]) {
            if (pages.length == pagesNum && player.queue.length > 10) paginate(client, message, pages, ['◀️', '▶️'], 120000, player.queue.length, parsedQueueDuration);
            else return message.channel.send({ embeds: [pages[0]] });
        }
        else {
            if (isNaN(args[0])) return message.channel.send('Page must be a number.');
            if (args[0] > pagesNum) return message.channel.send(`There are only ${pagesNum} pages available.`);
            const pageNum = args[0] == 0 ? 1 : args[0] - 1;
            return message.channel.send({ embeds: [pages[pageNum]] });
        }
    }

    async execute(client, interaction, args) {
        const query = args[0].value;

        let player = client.music.players.get(interaction.guild.id);
        if (!player) {
            player = client.music.newPlayer(interaction.guild, interaction.member.voice.channel, interaction.channel);
            player.connect();
        }

        if (player.queue.length > client.config.max.songsInQueue) return interaction.reply(`You have reached the **maximum** amount of songs (${client.config.max.songsInQueue} songs)`);

        const track = await client.music.search(query, interaction.user);

        player.queue.add(track);
        if (!player.playing) player.play();

        await interaction.reply({ embeds: [QueueHelper.queuedEmbed(track.title, client.config.urls.youtube + track.id, track.duration, null, interaction.user, client.config.colors.default)] });
    }
};
