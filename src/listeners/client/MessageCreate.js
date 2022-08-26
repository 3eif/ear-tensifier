const Discord = require('discord.js');
const Statcord = require('statcord.js');

const Event = require('../../structures/Event');
const MessageHelper = require('../../helpers/MessageHelper');
const Context = require('../../structures/Context');

const cooldowns = new Discord.Collection();

module.exports = class MessageCreate extends Event {
    constructor(...args) {
        super(...args);
    }

    async run(message) {
        if (message.author.bot) return;
        if (message.channel.type === 'GUILD_TEXT' && !message.guild.members.cache.get(this.client.user.id)) {
            await message.guild.members.fetch(this.client.user.id);
        }

        if (!message.channel.guild) return message.channel.send('I can\'t execute commands inside DMs! Please run this command in a server.');

        const ctx = new Context(message);

        const messageHelper = new MessageHelper(this.client, ctx);
        ctx.messageHelper = messageHelper;
        await messageHelper.createServer();

        const mentionPrefix = new RegExp(`^<@!?${this.client.user.id}>( |)$`);
        const rawMessageContent = message.content.toLowerCase();

        const prefix = await messageHelper.getPrefixFromMessage(rawMessageContent, mentionPrefix);
        if (!prefix) return;

        let args;
        let command;

        const messageContent = message.content.replace('`', '').replace('  ', ' ');

        if (prefix === process.env.PREFIX && !process.env.PREFIX.endsWith(' ')) {
            args = messageContent.split(' ');
            command = args.shift().toLowerCase();
            command = command.slice(process.env.PREFIX.length);
        }
        else if (prefix === process.env.PREFIX) {
            args = messageContent.split(' ');
            args.shift();
            command = args.shift().toLowerCase();
        }
        else if (prefix === messageHelper.server.prefix && !messageHelper.server.prefix.endsWith(' ')) {
            args = messageContent.split(' ');
            command = args.shift().toLowerCase();
            command = command.slice(messageHelper.server.prefix.length);
        }
        else {
            args = messageContent.split(' ');
            args.shift();
            command = args.shift().toLowerCase();
        }

        ctx.setArgs(args);

        let cmd;
        if (this.client.commands.has(command)) cmd = this.client.commands.get(command);
        else if (this.client.aliases.has(command)) cmd = this.client.aliases.get(command);
        else return;

        if (await messageHelper.isIgnored() || await messageHelper.isBlacklisted()) return;

        const commandName = cmd.name.toLowerCase();
        if (process.env.NODE_ENV == 'production') Statcord.ShardingClient.postCommand(commandName, ctx.author.id, this.client);

        this.client.databaseHelper.incrementTimesCommandUsed(cmd, ctx.author);
        await messageHelper.createUser();

        if (!cooldowns.has(commandName)) {
            cooldowns.set(commandName, new Discord.Collection());
        }

        if (cmd.permissions.dev && !this.client.config.devs.includes(message.author.id)) return;

        this.client.logger.command('%s used by %s from %s', commandName, message.author.id, message.guild.id);

        const permissionHelpMessage = `If you need help configuring the correct permissions for the bot join the support server: ${this.client.config.server}`;
        cmd.permissions.botPermissions.concat(['SEND_MESSAGES', 'EMBED_LINKS']);
        if (cmd.permissions.botPermissions.length > 0) {
            const missingPermissions = cmd.permissions.botPermissions.filter(perm => !message.guild.me.permissions.has(perm));
            if (missingPermissions.length > 0) {
                if (missingPermissions.includes('SEND_MESSAGES')) {
                    const user = this.client.users.cache.get('id');
                    if (!user) return;
                    else if (!user.dmChannel) await user.createDM();
                    await user.dmChannel.send(`I don't have the required permissions to execute this command. Missing permission(s): **${missingPermissions.join(', ')}**\n${permissionHelpMessage}`);
                }
                return message.channel.send(`I don't have the required permissions to execute this command. Missing permission(s): **${missingPermissions.join(', ')}**\n${permissionHelpMessage}`);
            }
        }

        if (cmd.permissions.userPermissions.length > 0) {
            const missingPermissions = cmd.permissions.userPermissions.filter(perm => !message.member.permissions.has(perm));
            if (missingPermissions.length > 0) {
                return message.channel.send(`You don't have the required permissions to execute this command. Missing permission(s): **${missingPermissions.join(', ')}**`);
            }
        }

        if (!message.guild && cmd.guildOnly) return message.channel.send('I can\'t execute that command inside DMs!. Please run this command in a server.');

        if (cmd.voiceRequirements.isInVoiceChannel && !message.member.voice.channel) return messageHelper.sendResponse('noVoiceChannel');
        else if (cmd.voiceRequirements.isInSameVoiceChannel && message.guild.me.voice.channel && !message.guild.me.voice.channel.equals(message.member.voice.channel)) return messageHelper.sendResponse('sameVoiceChannel');
        else if (cmd.voiceRequirements.isPlaying && !this.client.music.players.get(message.guild.id)) return messageHelper.sendResponse('noSongsPlaying');

        if (prefix == process.env.PREFIX) {
            if (!args[0] && cmd.args === true && ((cmd.acceptsAttachments && message.attachments.size == 0) || !cmd.acceptsAttachments)) {
                const embed = new Discord.EmbedBuilder()
                    .setDescription(`You didn't provide any arguments ${message.author}.\nCorrect Usage: \`ear ${commandName} ${cmd.description.usage}\``);
                return message.channel.send({ embeds: [embed] });
            }
        }
        else if (!args[0] && cmd.args === true && ((cmd.acceptsAttachments && message.attachments.size == 0) || !cmd.acceptsAttachments)) {
            const embed = new Discord.EmbedBuilder()
                .setDescription(`You didn't provide any arguments ${message.author}.\nCorrect Usage: \`${prefix} ${commandName} ${cmd.description.usage}\` or \`${prefix}${cmd.name} ${cmd.description.usage}\``);
            return message.channel.send({ embeds: [embed] });
        }

        if (cmd.permissions.botPermissions.includes(Discord.Permissions.CONNECT) && !message.member.voice.channel.permissionsFor(this.client.user).has(Discord.Permissions.CONNECT)) return messageHelper.sendResponse('noPermissionConnect');
        if (cmd.permissions.botPermissions.includes(Discord.Permissions.SPEAK) && !message.member.voice.channel.permissionsFor(this.client.user).has(Discord.Permissions.SPEAK)) return messageHelper.sendResponse('noPermissionSpeak');

        if (!this.client.config.devs.includes(message.author.id)) {
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

        if (messageContent.includes('@here') || messageContent.includes('@everyone')) {
            return message.channel.send('Your argument included an `@here` or `@everyone` which is an invalid argument type.');
        }

        try {
            cmd.run(this.client, ctx, ctx.args);
        }
        catch (e) {
            this.client.logger.error(e);
            message.reply('There was an error trying to execute that command!');
        }
    }
};
