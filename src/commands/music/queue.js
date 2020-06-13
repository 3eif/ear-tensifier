/* eslint-disable no-unused-vars */
const Command = require('../../structures/Command');

const Discord = require('discord.js');
const moment = require('moment');
const momentDurationFormatSetup = require('moment-duration-format');
momentDurationFormatSetup(moment);
const fetch = require('node-fetch');
const columnify = require('columnify');
const Pagination = require('discord-paginationembed');

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

		let index = 1;
		let queueStr = '';
		const { title, author, length, uri } = player.current;

		const parsedDuration = moment.duration(length, 'milliseconds').format('mm:ss', { trim: false });
		const parsedQueueDuration = moment.duration(getQueueDuration(player), 'milliseconds').format('mm:ss', { trim: false });

		const FieldsEmbed = new Pagination.FieldsEmbed()
			// A must: an array to paginate, can be an array of any type
			.setArray([{ word: 'they are' }, { word: 'being treated' }])
			// Set users who can only interact with the instance. Default: `[]` (everyone can interact).
			// If there is only 1 user, you may omit the Array literal.
			.setAuthorizedUsers([message.author.id])
			// A must: sets the channel where to send the embed
			.setChannel(message.channel)
			// Elements to show per page. Default: 10 elements per page
			.setElementsPerPage(2)
			// Have a page indicator (shown on message content). Default: false
			.setPageIndicator(false)
			// Format based on the array, in this case we're formatting the page based on each object's `word` property
			.formatField('Continue...', el => el.word);

		// Customise embed
		FieldsEmbed.embed
			.setColor(0x00FFFF)
			.setTitle('Jesus Yamato Saves the Day by Obliterating a Swarm of Abyssal Bombers!')
			.setDescription('Akagi and Kaga give their thanks to their holy saviour today as...')
			.setImage('https://lh5.googleusercontent.com/-TIcwCxc7a-A/AAAAAAAAAAI/AAAAAAAAAAA/Hij7_7Qa1j0/s900-c-k-no/photo.jpg');

		// Deploy embed
		FieldsEmbed.build();


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