const fs = require("fs");
const Discord = require("discord.js");
const cooldowns = new Discord.Collection();
const Event = require('../../structures/Event');

const users = require("../../models/user.js")
const servers = require("../../models/server.js");
const bot = require("../../models/bot.js");
const commandsSchema = require("../../models/command.js");

const webhooks = require("../../resources/webhooks.json");

const webhookClient = new Discord.WebhookClient(webhooks.messageID, webhooks.messageToken);

module.exports = class Message extends Event {
  constructor(...args) {
    super(...args)
  }

  async run(message) {
    if (message.author.bot) return;
    if (message.channel.type === "text") {
      if (!message.channel.permissionsFor(message.guild.me).missing("SEND_MESSAGES")) return;
    }

    if (!message.channel.guild) return message.channel.send("I can't execute commands inside DMs! Please run this command in a server.");

    const mentionPrefix = new RegExp(`^<@!?${this.client.user.id}>( |)$`);
    let prefix;
    let ignoreMsg;
    servers.findOne({
      serverID: message.guild.id,
    }, async (err, s) => {
      if (err) console.log(err);
      if (!s) {
        const newServer = new servers({
          serverID: message.guild.id,
          serverName: message.guild.name,
          prefix: this.client.settings.prefix,
          ignore: [],
        });
        await newServer.save().catch(e => console.log(e));
        prefix = message.content.match(mentionPrefix) ? message.content.match(mentionPrefix)[0] : this.client.settings.prefix;
        ignoreMsg = false;
      } else {
        prefix = message.content.match(mentionPrefix) ? message.content.match(mentionPrefix)[0] : s.prefix;
        if (s.ignore.includes(message.channel.id)) ignoreMsg = true;
      }

      if (ignoreMsg) return;
      if (prefix == this.client.settings.prefix) {
        if (message.content.toLowerCase().indexOf(this.client.settings.prefix) !== 0 && message.content.toLowerCase().indexOf(prefix.slice(0, -1)) !== 0) return;
      } else if (message.content.toLowerCase().indexOf(prefix) !== 0 && message.content.toLowerCase().indexOf(prefix + " ") !== 0) return;
      const args = message.content.slice(prefix.length).trim().split(/ +/g);

      users.findOne({
        authorID: message.author.id
      }, async (err, u) => {
        if (err) console.log(err);
        if (!u) {
          const newUser = new users({
            authorID: message.author.id,
            authorName: message.author.tag,
            bio: "",
            songsPlayed: 0,
            commandsUsed: 1,
            blocked: false,
            supporter: false,
            supporterPlus: false,
            supporterPlusPlus: false,
            supporterInfinite: false,
            developer: false,
          });
          await newUser.save().catch(e => console.log(e));
        } else {
          if (u.blocked == null) u.blocked = false;
          if (u.blocked) ignoreMsg = true;
          else if (!u.blocked) u.commandsUsed += 1;
          await u.save().catch(e => console.log(e));
        }

        if (ignoreMsg) return;

        const command = args.shift().toLowerCase();
        const cmd = this.client.commands.get(command) || this.client.commands.find(c => c.aliases && c.aliases.includes(command));
        if (!cmd) {
          if (fs.existsSync(`./commands/${command}.js`)) {
            try {
              const commandFile = require(`./commands/${command}.js`);
              if (commandFile) commandFile.run(this.client, message, args);
            } catch (error) {
              console.error(error);
              message.reply("There was an error trying to execute that command!");
            }
          }
          return;
        }

        bot.findOne({
          clientID: this.client.user.id
        }, async (err, b) => {
          if (err) console.log(err);
          if (!b) {
            const newClient = new bot({
              clientID: this.client.user.id,
              clientName: this.client.user.name,
              messagesSent: 0,
              songsPlayed: 0,
            });
            await newClient.save().catch(e => console.log(e));
          }

          b.messagesSent += 1;
          await b.save().catch(e => console.log(e));
        });

        commandsSchema.findOne({
          commandName: cmd.name
        }, async (err, c) => {
          if (err) console.log(err);
          if (!c) {
            const newCommand = new commandsSchema({
              commandName: cmd.name,
              timesUsed: 1,
            });
            await newCommand.save().catch(e => console.log(e));
          }

          c.timesUsed += 1;
          await c.save().catch(e => console.log(e));
        });

        console.log(`${cmd.name} used by ${message.author.tag} (${message.author.id}) from ${message.guild.name} (${message.guild.id})`)
        const embed = new Discord.MessageEmbed()
          .setAuthor(`${message.author.username}`, message.author.displayAvatarURL())
          .setColor(this.client.colors.main)
          .setDescription(`**${cmd.name}** command used by **${message.author.tag}** (${message.author.id})`)
          .setFooter(`${message.guild.name} (${message.guild.id})`, message.guild.iconURL())
          .setTimestamp()

        webhookClient.send({
          username: 'Ear Tensifier',
          avatarURL: this.client.settings.avatar,
          embeds: [embed],
        });

        if (!cooldowns.has(cmd.name)) {
          cooldowns.set(cmd.name, new Discord.Collection());
        }
        if (cmd.permission === "dev" && !this.client.settings.devs.includes(message.author.id)) return;;

        if (cmd && !message.guild && cmd.guildOnly) return message.channel.send("I can't execute that command inside DMs!. Please run this command in a server.");

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

        if (prefix == this.client.settings.prefix) if (cmd && !args.length && cmd.args === true) return message.channel.send(`You didn't provide any arguments ${message.author}.\nCorrect Usage: \`ear ${cmd.name} ${cmd.usage}\``);
        else if (cmd && !args.length && cmd.args === true) return message.channel.send(`You didn't provide any arguments ${message.author}.\nCorrect Usage: \`${prefix}${cmd.name} ${cmd.usage}\``);

        try {
          cmd.execute(this.client, message, args);
        } catch (e) {
          console.error(e);
          message.reply("There was an error trying to execute that command!");
        }
      });
    });
  }
}