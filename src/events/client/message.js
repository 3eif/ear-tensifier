/* eslint-disable no-unused-vars */
const fs = require('fs');
const Discord = require('discord.js');
const cooldowns = new Discord.Collection();
const Event = require('../../structures/Event');

const users = require('../../models/user.js');
const servers = require('../../models/server.js');
const bot = require('../../models/bot.js');
const commandsSchema = require('../../models/command.js');
const settings = require('../../settings.js');

const webhooks = require('../../resources/webhooks.json');
const webhookClient = new Discord.WebhookClient(webhooks.messageID, webhooks.messageToken);

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
		let prefix;

		async function getIgnore() {
			servers.findOne({
				serverID: message.guild.id,
			}, async (err, s) => {
				if (err) this.client.log(err);
				if (!s) {
					const newServer = new servers({
						serverID: message.guild.id,
						serverName: message.guild.name,
						prefix: settings.prefix,
						ignore: [],
					});
					await newServer.save().catch(e => this.client.log(e));
					prefix = message.content.split(' ')[0].match(mentionPrefix) || settings.prefix;
					return false;
				}
				else {
					// eslint-disable-next-line no-lonely-if
					if (s.ignore.includes(message.channel.id)) return true;
					else return false;
				}
			});
		}

		console.log(getIgnore());

		async function getPrefix() {
			servers.findOne({
				serverID: message.guild.id,
			}, async (err, s) => {
				if (err) this.client.log(err);
				if (!s) {
					const newServer = new servers({
						serverID: message.guild.id,
						serverName: message.guild.name,
						prefix: this.client.settings.prefix,
						ignore: [],
					});
					await newServer.save().catch(e => this.client.log(e));
					prefix = message.content.split(' ')[0].match(mentionPrefix) || this.client.settings.prefix;
					return prefix;
				}
				else {
					return s.prefix;
				}
			});
		}

			const messageContent = message.content.toLowerCase();
			if (messageContent.indexOf(this.client.settings.prefix) === 0) {
				prefix = this.client.settings.prefix;
			}
			else if (messageContent.split(' ')[0].match(mentionPrefix)) {
				prefix = mentionPrefix;
			}
			else {
				return;
			}

			if (getIgnore()) return;
			let args;
			let command;

			if (prefix === this.client.settings.prefix && !this.client.settings.prefix.endsWith(' ')) {
				args = message.content.split(' ');
				command = args.shift().toLowerCase();
				command = command.slice(this.client.settings.prefix.length);
			}
			else if (prefix === getPrefix() && !getPrefix().endsWith(' ')) {
				args = message.content.split(' ');
				command = args.shift().toLowerCase();
				command = command.slice(getPrefix().length);
			}
			else {
				args = message.content.split(' ');
				args.shift();
				command = args.shift().toLowerCase();
			}

			users.findOne({ authorID: message.author.id }).then(async messageUser => {
				if (!messageUser) {
					const newUser = new users({
						authorID: message.author.id,
						authorName: message.author.tag,
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
				}

				if (messageUser.blocked == null) messageUser.blocked = false;
				else if (!messageUser.blocked) messageUser.commandsUsed += 1;
				messageUser.save().catch(e => console.error(e));
			});

			const cmd = this.client.commands.get(command) || this.client.commands.find(c => c.aliases && c.aliases.includes(command));
			if (!cmd) return;

			/* Async Non-Blocking */
			bot.findOne({ clientID: this.client.user.id }).then(async b => {
				if (!b) {
					const newClient = new bot({
						clientID: this.client.user.id,
						clientName: this.client.user.name,
						messagesSent: 0,
						songsPlayed: 0,
					});
					await newClient.save().catch(e => this.client.log(e));
					b = await bot.findOne({ clientID: this.client.user.id });
				}

				b.messagesSent += 1;
				b.save().catch(e => this.client.log(e));
			});

			/* Async Non-Blocking */
			commandsSchema.findOne({ commandName: cmd.name }).then(async c => {
				if (!c) {
					const newCommand = new commandsSchema({
						commandName: cmd.name,
						timesUsed: 0,
					});
					await newCommand.save().catch(e => this.client.log(e));
					c = await commandsSchema.findOne({ commandName: cmd.name });
				}

				c.timesUsed += 1;
				await c.save().catch(e => this.client.log(e));
			});

			this.client.log(`[Shard #${this.client.shard.ids}] ${cmd.name} used by ${message.author.tag} (${message.author.id}) from ${message.guild.name} (${message.guild.id})`);
			const embed = new Discord.MessageEmbed()
				.setAuthor(`${message.author.username}`, message.author.displayAvatarURL())
				.setColor(this.client.colors.main)
				.setDescription(`**${cmd.name}** command used by **${message.author.tag}** (${message.author.id})`)
				.setFooter(`${message.guild.name} (${message.guild.id})`, message.guild.iconURL())
				.setTimestamp();

			webhookClient.send({
				username: 'Ear Tensifier',
				avatarURL: this.client.settings.avatar,
				embeds: [embed],
			});

			if (!cooldowns.has(cmd.name)) {
				cooldowns.set(cmd.name, new Discord.Collection());
			}
			if (cmd.permission === 'dev' && !this.client.settings.devs.includes(message.author.id)) return;

			if (cmd && !message.guild && cmd.guildOnly) return message.channel.send('I can\'t execute that command inside DMs!. Please run this command in a server.');

			if (!this.client.settings.devs.includes(message.author.id)) {
				if (!cooldowns.has(cmd.name)) {
					cooldowns.set(cmd.name, new Discord.Collection());
				}
				const now = Date.now();
				const timestamps = cooldowns.get(cmd.name);
				const cooldownAmount = (cmd.cooldown || 5) * 1000;
				if (!timestamps.has(message.author.id)) {
					timestamps.set(message.author.id, now);
					setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
				}
				else {
					const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
					if (now < expirationTime) {
						const timeLeft = (expirationTime - now) / 1000;
						return message.reply(`Please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${cmd.name}\` command.`);
					}
					timestamps.set(message.author.id, now);
					setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
				}
			}

			if (cmd.inVoiceChannel && !message.member.voice.channel) return this.client.responses('noVoiceChannel', message);
			else if (cmd.sameVoiceChannel && message.member.voice.channel.id != message.guild.members.cache.get(this.client.user.id).voice.channelID) return this.client.responses('sameVoiceChannel', message);
			else if (cmd.playing && !this.client.music.players.get(message.guild.id)) return this.client.responses('noSongsPlaying', message);

			if (prefix == this.client.settings.prefix) {
				if (cmd && !args[0] && cmd.args === true) return message.channel.send(`You didn't provide any arguments ${message.author}.\nCorrect Usage: \`ear ${cmd.name} ${cmd.usage}\``);
			}
			else if (cmd && !args[0] && cmd.args === true) {
				return message.channel.send(`You didn't provide any arguments ${message.author}.\nCorrect Usage: \`${prefix} ${cmd.name} ${cmd.usage}\` or \`${prefix}${cmd.name} ${cmd.usage}\``);
			}

			try {
				cmd.execute(this.client, message, args);
			}
			catch (e) {
				console.error(e);
				message.reply('There was an error trying to execute that command!');
			}
	}
};
