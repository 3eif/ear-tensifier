/* eslint-disable no-unused-vars */
const Discord = require('discord.js');
const Statcord = require('statcord.js');
const chalk = require('chalk');
const cooldowns = new Discord.Collection();

const Event = require('../../structures/Event');
const users = require('../../models/user.js');
const servers = require('../../models/server.js');
const commandsSchema = require('../../models/command.js');
const premium = require('../../utils/misc/premium.js');
const getVoted = require('../../utils/voting/getVoted.js');
const bot = require('../../models/bot.js');

module.exports = class Message extends Event {
	constructor(...args) {
		super(...args);
	}

	async run(message) {
		if (message.author.bot) return;
		if (message.channel.type === 'text') {
			if (!message.guild.members.cache.get(this.client.user.id)) await message.guild.members.fetch(this.client.user.id);
			if (!message.channel.permissionsFor(message.guild.me).missing('SEND_MESSAGES')) return;
		}

		if (!message.channel.guild) return message.channel.send('I can\'t execute commands inside DMs! Please run this command in a server.');

		const mentionPrefix = new RegExp(`^<@!?${this.client.user.id}>( |)$`);
		const rawMessageContent = message.content.toLowerCase();
		let prefix;
		servers.findOne({
			serverID: message.guild.id,
		}, async (err, s) => {
			if (err) this.client.log(err);
			if (!s) {
				const newServer = new servers({
					serverID: message.guild.id,
					prefix: this.client.settings.prefix,
					ignore: [],
				});
				await newServer.save().catch(e => this.client.log(e));
				prefix = rawMessageContent.split(' ')[0].match(mentionPrefix) || this.client.settings.prefix;

				if (rawMessageContent.indexOf(this.client.settings.prefix) === 0) {
					prefix = this.client.settings.prefix;
				}
				else if (rawMessageContent.split(' ')[0].match(mentionPrefix)) {
					prefix = mentionPrefix;
				}
				else {
					return;
				}
			}
			else {
				if (s.ignore.includes(message.channel.id)) { return; }

				if (rawMessageContent.indexOf(this.client.settings.prefix) === 0) {
					prefix = this.client.settings.prefix;
				}
				else if (rawMessageContent.indexOf(s.prefix) === 0) {
					prefix = s.prefix;
				}
				else if (rawMessageContent.split(' ')[0].match(mentionPrefix)) {
					prefix = mentionPrefix;
				}
				else {
					return;
				}
			}

			let args;
			let command;

			const messageContent = message.content.replace('`', '');

			if (prefix === this.client.settings.prefix && !this.client.settings.prefix.endsWith(' ')) {
				args = messageContent.split(' ');
				command = args.shift().toLowerCase();
				command = command.slice(this.client.settings.prefix.length);
			}
			else if (prefix === this.client.settings.prefix) {
				args = messageContent.split(' ');
				args.shift();
				command = args.shift().toLowerCase();
			}
			else if (prefix === s.prefix && !s.prefix.endsWith(' ')) {
				args = messageContent.split(' ');
				command = args.shift().toLowerCase();
				command = command.slice(s.prefix.length);
			}
			else {
				args = messageContent.split(' ');
				args.shift();
				command = args.shift().toLowerCase();
			}

			users.findOne({ authorID: message.author.id }).then(async messageUser => {
				if (!messageUser) {
					const newUser = new users({
						authorID: message.author.id,
						bio: '',
						songsPlayed: 0,
						commandsUsed: 1,
						blocked: false,
						premium: false,
						pro: false,
						developer: false,
					});
					await newUser.save().catch(e => this.client.log(e));
					messageUser = await users.findOne({ authorID: message.author.id });
					await runCommand(this.client);
				}
				else {
					if (messageUser.blocked == null) messageUser.blocked = false;
					if (!messageUser.blocked) {
						messageUser.commandsUsed += 1;
						await runCommand(this.client);
					}
					await messageUser.save().catch(e => console.error(e));
				}
			});

			async function runCommand(client) {
				bot.findOne({ clientID: client.user.id }).then(async b => {
					if (!b) {
						const newClient = new bot({
							clientID: client.user.id,
							clientName: client.user.name,
							commandsUsed: 0,
							songsPlayed: 0,
						});
						await newClient.save().catch(e => client.log(e));
						b = await bot.findOne({ clientID: client.user.id });
					}

					b.commandsUsed += 1;
					b.save().catch(e => client.log(e));
				});

				let cmd;
				if (client.commands.has(command)) cmd = client.commands.get(command);
				else if (client.aliases.has(command)) cmd = client.aliases.get(command);
				else return;

				if(message.guild.id != '264445053596991498') {
					const permissions = message.channel.permissionsFor(client.user);
					if (!permissions.has('SEND_MESSAGES') || !permissions.has('READ_MESSAGE_HISTORY')) return message.author.send(`I don't have permission to read/send messages in **${message.channel.name}**!\nPlease join the support server if you need help: ${client.settings.server}`);
					if (!permissions.has('EMBED_LINKS')) return message.channel.send(`I don't have permission to send embeds in **${message.channel.name}**!\nPlease join the support server if you need help: ${client.settings.server}`);
				}
				const commandName = cmd.name.toLowerCase();
				if (process.env.NODE_ENV == 'production') Statcord.ShardingClient.postCommand(commandName, message.author.id, client);
				/* Async Non-Blocking */
				commandsSchema.findOne({ commandName: commandName }).then(async c => {
					if (!c) {
						const newCommand = new commandsSchema({
							commandName: commandName,
							timesUsed: 0,
						});
						await newCommand.save().catch(e => client.log(e));
						c = await commandsSchema.findOne({ commandName: commandName });
					}

					c.timesUsed += 1;
					await c.save().catch(e => client.log(e));
				});

				client.log(chalk.white.dim(`[Shard ${Number(client.shard.ids) + 1}] ${commandName} used by ${message.author.id} from ${message.guild.id}`));

				if (!cooldowns.has(commandName)) {
					cooldowns.set(commandName, new Discord.Collection());
				}

				if (cmd.permission === 'dev' && !client.settings.devs.includes(message.author.id)) return;

				if (!client.settings.devs.includes(message.author.id)) {
					if (cmd.permission === 'premium' && await premium(message.author.id, 'Premium') == false) return client.responses('noPremium', message);
					if (cmd.permission === 'pro' && await premium(message.author.id, 'Pro') == false) return client.responses('noPro', message);
				}

				if (cmd.voteLocked == true && await premium(message.author.id, 'Premium') == false && await premium(message.author.id, 'Pro') == false) {
					const voted = await getVoted(client, message.author);
					if (!voted) {
						const voteEmbed = new Discord.MessageEmbed()
							.setDescription('You must **vote** to use this command. **You can vote [here](https://top.gg/bot/472714545723342848/vote)**.\nYou can bypass vote locked commands by purchasing premium [here](https://www.patreon.com/eartensifier).')
							.setFooter('Already voted? It might take a few seconds for your vote to process.');
						return message.channel.send(voteEmbed);
					}
				}

				if (!message.guild && cmd.guildOnly) return message.channel.send('I can\'t execute that command inside DMs!. Please run this command in a server.');

				if (cmd.inVoiceChannel && !message.member.voice.channel) return client.responses('noVoiceChannel', message);
				else if (cmd.sameVoiceChannel && message.member.voice.channel.id !== message.guild.me.voice.channelID) return client.responses('sameVoiceChannel', message);
				else if (cmd.playing && !client.music.players.get(message.guild.id)) return client.responses('noSongsPlaying', message);

				if (prefix == client.settings.prefix) {
					if (!args[0] && cmd.args === true) {
						const embed = new Discord.MessageEmbed()
						.setDescription(`You didn't provide any arguments ${message.author}.\nCorrect Usage: \`ear ${commandName} ${cmd.usage}\``);
						return message.channel.send(embed);
					}
				}
				else if (!args[0] && cmd.args === true) {
					const embed = new Discord.MessageEmbed()
					.setDescription(`You didn't provide any arguments ${message.author}.\nCorrect Usage: \`${prefix} ${commandName} ${cmd.usage}\` or \`${prefix}${cmd.name} ${cmd.usage}\``);
					return message.channel.send(embed);
				}

				if (cmd.botPermissions.includes('CONNECT') && !message.member.voice.channel.permissionsFor(client.user).has('CONNECT')) return client.responses('noPermissionConnect', message);
				if (cmd.botPermissions.includes('SPEAK') && !message.member.voice.channel.permissionsFor(client.user).has('SPEAK')) return client.responses('noPermissionSpeak', message);

				if (!client.settings.devs.includes(message.author.id)) {
					if (!cooldowns.has(commandName)) {
						cooldowns.set(commandName, new Discord.Collection());
					}
					const now = Date.now();
					const timestamps = cooldowns.get(commandName);
					const cooldownAmount = Math.floor(cmd.cooldown || 5) * 1000;
					if (!timestamps.has(message.author.id)) {
						timestamps.set(message.author.id, now);
						setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
					}
					else {
						const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
						const timeLeft = (expirationTime - now) / 1000;
						if (now < expirationTime && timeLeft > 0.9) {
							return message.reply(`Please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${commandName}\` command.`);
						}
						timestamps.set(message.author.id, now);
						setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
					}
				}

				const everyoneMention = '@everyone';
				const hereMention = '@here';
				if (messageContent.includes(hereMention) || messageContent.includes(everyoneMention)) {
					return message.channel.send('Your argument included an `@here` or `@everyone` which is an invalid argument type.');
				}

				try {
					
					cmd.run(client, message, args);
				}
				catch (e) {
					console.error(e);
					message.reply('There was an error trying to execute that command!');
				}
			}
		});
	}
};
