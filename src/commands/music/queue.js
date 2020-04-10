const Command = require('../../structures/Command');

const Discord = require('discord.js');
const { Utils } = require('erela.js');
const fetch = require('node-fetch');
const columnify = require('columnify');

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
		const { title, author, duration, uri } = player.queue[0];

		if (player.queue.size > 10) {
			const songs = [];
			// eslint-disable-next-line no-async-promise-executor
			const content = new Promise(async function(resolve) {
				for (let i = 0; i < player.queue.length; i++) {
					const song = player.queue[i];
					const songObj = {
						number: i + 1,
						song: song.title,
						author: song.author,
						duration: Utils.formatTime(song.duration, true),
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
							.setDescription(`**Now Playing** - [${title}](${uri}) (${Utils.formatTime(duration, true)}) by ${author}.\n\n${player.queue.slice(1, 11).map(song => `**${index++}** - [${song.title}](${song.uri}) (${Utils.formatTime(song.duration, true)}) by ${song.author}.`).join('\n')}${queueStr}`)
							.setFooter(`${player.queue.size} songs | ${Utils.formatTime(player.queue.duration, true)} total duration`);
						message.channel.send(queueEmbed);
					})
					.catch(error => client.log('error', error));
			});
		}
		else {
			queueStr = `${player.queue.slice(1, 11).map(song => `**${index++}** - [${song.title}](${song.uri}) (${Utils.formatTime(song.duration, true)}) by ${song.author}.`).join('\n')}`;
			const queueEmbed = new Discord.MessageEmbed()
				.setAuthor(`Queue - ${message.guild.name}`, message.guild.iconURL())
				.setColor(client.colors.main)
				.setDescription(`**Now Playing** - [${title}](${uri}) (${Utils.formatTime(duration, true)}) by ${author}.\n\n${queueStr}`)
				.setFooter(`${player.queue.size} songs | ${Utils.formatTime(player.queue.duration, true)} total duration`);
			message.channel.send(queueEmbed);
		}
	}
};