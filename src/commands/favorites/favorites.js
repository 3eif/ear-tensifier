/* eslint-disable no-unused-vars */
const Command = require('../../structures/Command');

const Discord = require('discord.js');
const fetch = require('node-fetch');
const users = require('../../models/user.js');
const moment = require('moment');
const momentDurationFormatSetup = require('moment-duration-format');
momentDurationFormatSetup(moment);
const columnify = require('columnify');

module.exports = class Favorites extends Command {
	constructor(client) {
		super(client, {
			name: 'favorites',
			description: 'Displays a list of your favorite songs.',
			cooldown: 10,
		});
	}
	async run(client, message) {
		const msg = await message.channel.send(`${client.emojiList.loading} Fetching favorites...`);

		users.findOne({
			authorID: message.author.id,
		}, async (err, u) => {
			if (err) client.log(err);

			if(u.favorites.length === 0 || !u.favorites) {
				return msg.edit('You have no favorites. To add favorites type `ear add <search query/link>`');
			}

			let str = '';
			const songs = [];

			// eslint-disable-next-line no-async-promise-executor
			const content = new Promise(async function(resolve) {
				for (let i = 0; i < u.favorites.length; i++) {
					const song = u.favorites[i];
					const url = `https://www.youtube.com/watch?v=${song.identifier}`;
					const parsedDuration = moment.duration(song.duration, 'milliseconds').format('hh:mm:ss', { trim: false });
					str += `**${i + 1}** - [${song.title}](${url}) (${parsedDuration}) by ${song.author}\n`;
					const songObj = {
						number: i + 1,
						song: song.title,
						author: song.author,
						duration: parsedDuration,
					};
					songs.push(songObj);
				}
				resolve();
			});

			content.then(async function() {
				if (str.length < 2048) {
					const embed = new Discord.MessageEmbed()
						.setAuthor(message.author.tag, message.author.displayAvatarURL())
						.setThumbnail(message.author.displayAvatarURL())
						.setTitle('Favorite Songs')
						.setDescription(str)
						.setColor(client.colors.main)
						.setTimestamp();
					msg.edit('', embed);
				}
				else {
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
							const embed = new Discord.MessageEmbed()
								.setTitle('Too many favorite songs, uploaded to hastebin!')
								.setURL(`https://www.hasteb.in/${result.slice(8, result.length - 2)}.txt`)
								.setColor(client.colors.main);
							msg.edit('', embed);
						})
						.catch(error => client.log('error', error));
				}
				await u.save().catch(e => client.log(e));
			});
		});
	}
};