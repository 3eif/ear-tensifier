const Command = require('../../structures/Command');

const Discord = require('discord.js');
const moment = require('moment');
const momentDurationFormatSetup = require('moment-duration-format');
momentDurationFormatSetup(moment);
const fetch = require('node-fetch');
const columnify = require('columnify');

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

		if (player.queue.length > 10) {
			const songs = [];
			// eslint-disable-next-line no-async-promise-executor
			const content = new Promise(async function(resolve) {
				for (let i = 0; i < player.queue.length; i++) {
					const song = player.queue[i];
					const parsedSongDuration = moment.duration(song.length, 'milliseconds').format('mm:ss', { trim: false });
					const songObj = {
						number: i + 1,
						song: song.title,
						author: song.author,
						duration: parsedSongDuration,
					};
					songs.push(songObj);
				}
				resolve();
			});

			content.then(async function() {
				const columns = columnify(songs, {
					minWidth: 5,
					columnSplitter: ' | ',
					config: {
						song: { maxWidth: 125 },
					},
				});

				const myHeaders = new fetch.Headers();
				myHeaders.append('Content-Type', 'text/plain');
				const requestOptions = {
					method: 'POST',
					headers: myHeaders,
					body: columns,
					redirect: 'follow',
				};

				fetch('https://hasteb.in/documents', requestOptions)
					.then(response => response.text())
					.then(result => {
						queueStr += `\n...and ${player.queue.length - 10} more [here](https://www.hasteb.in/${result.slice(8, result.length - 2)}.txt)`;
						const queueEmbed = new Discord.MessageEmbed()
							.setAuthor(`Queue - ${message.guild.name}`, message.guild.iconURL())
							.setColor(client.colors.main)
							.setDescription(`**Now Playing** - [${title}](${uri}) \`[${parsedDuration}]\` by ${author}.\n\n${player.queue.slice(0, 10).map(song => `**${index++}** - [${song.title}](${song.uri}) (${moment.duration(song.length, 'milliseconds').format('mm:ss', { trim: false })}) by ${song.author}.`).join('\n')}${queueStr}`)
							.setFooter(`${player.queue.length} songs | ${parsedQueueDuration} total duration`);
						message.channel.send(queueEmbed);
					})
					.catch(error => client.log('error', error));
			});
		}
		else {
			queueStr = `${player.queue.slice(0, 10).map(song => `**${index++}** - [${song.title}](${song.uri}) \`[${moment.duration(song.length, 'milliseconds').format('mm:ss', { trim: false })}]\` by ${song.author}.`).join('\n')}`;
			const queueEmbed = new Discord.MessageEmbed()
				.setAuthor(`Queue - ${message.guild.name}`, message.guild.iconURL())
				.setColor(client.colors.main)
				.setDescription(`**Now Playing** - [${title}](${uri}) \`[${parsedDuration}]\` by ${author}.\n\n${queueStr}`)
				.setFooter(`${player.queue.length} songs | ${parsedQueueDuration} total duration`);
			message.channel.send(queueEmbed);
		}
	}
};