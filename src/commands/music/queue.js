/* eslint-disable no-unused-vars */
const Command = require('../../structures/Command');

const Discord = require('discord.js');
const moment = require('moment');
const momentDurationFormatSetup = require('moment-duration-format');
momentDurationFormatSetup(moment);
const fetch = require('node-fetch');
const columnify = require('columnify');
const { Menu } = require('discord.js-menu');

const getQueueDuration = require('../../utils/music/getQueueDuration.js');

module.exports = class Queue extends Command {
	constructor(client) {
		super(client, {
			name: 'queue',
			description: 'Displays the queue.',
			aliases: ['q'],
			playing: true,
		});
	}
	async run(client, message) {
		const player = client.music.players.get(message.guild.id);

		const index = 1;
		const queueStr = '';
		const { title, author, length, uri } = player.current;

		const parsedDuration = moment.duration(length, 'milliseconds').format('mm:ss', { trim: false });
		const parsedQueueDuration = moment.duration(getQueueDuration(player), 'milliseconds').format('mm:ss', { trim: false });

        new Menu(message.channel, message.author.id, [
            {
                name: 'main',
                content: new Discord.MessageEmbed({
                    title: 'Help',
                    description: 'Commands list:',
                    fields: [
                        {
                            name: 'command1',
                            value: 'this command does stuff',
                        },
                    ],
                }),
                reactions: {
                    '⏹': 'stop',
                    '▶': 'next',
                    '⚙': 'otherPage',
                },
            },
            {
                name: 'otherPage',
                content: new Discord.MessageEmbed({
                    title: 'More Help!',
                    description: 'Here are some more commands!',
                    fields: [
                        {
                            name: 'You get the idea.',
                            value: 'You can create as many of these pages as you like.',
                            // (Each page can only have 20 reactions, though. Discord's fault.)
                        },
                    ],
                }),
                reactions: {
                    '⏹': 'stop',
                    '◀': 'previous',
                    '1️⃣': 'first',
                },
            },
        ]);


		// if (player.queue.length > 10) {
		// 	const FieldsEmbed = new Pagination.FieldsEmbed()
		// 		.setArray([{ name: 'John Doe' }, { name: 'Jane Doe' }])
		// 		.setAuthorizedUsers([message.author.id])
		// 		.setChannel(message.channel)
		// 		.setElementsPerPage(1)
		// 		// Initial page on deploy
		// 		.setPage(2)
		// 		.setPageIndicator(true)
		// 		.formatField('Name', i => i.name)
		// 		// Deletes the embed upon awaiting timeout
		// 		.setDeleteOnTimeout(true)
		// 		// Disable built-in navigation emojis, in this case: 🗑 (Delete Embed)
		// 		.setDisabledNavigationEmojis(['delete'])
		// 		// Sets whether function emojis should be deployed after navigation emojis
		// 		.setEmojisFunctionAfterNavigation(false);

		// 	FieldsEmbed.embed
		// 		.setColor(0xFF00AE)
		// 		.setDescription('Test Description');

		// 	await FieldsEmbed.build();
		// }
		// else {
		// 	queueStr = `${player.queue.slice(0, 10).map(song => `**${index++}** - [${song.title}](${song.uri}) \`[${moment.duration(song.length, 'milliseconds').format('mm:ss', { trim: false })}]\` by ${song.author}.`).join('\n')}`;
		// 	const queueEmbed = new Discord.MessageEmbed()
		// 		.setAuthor(`Queue - ${message.guild.name}`, message.guild.iconURL())
		// 		.setColor(client.colors.main)
		// 		.setDescription(`**Now Playing** - [${title}](${uri}) \`[${parsedDuration}]\` by ${author}.\n\n${queueStr}`)
		// 		.setFooter(`${player.queue.length} songs | ${parsedQueueDuration} total duration`);
		// 	message.channel.send(queueEmbed);
		// }
	}
};