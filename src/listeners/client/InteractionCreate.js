const Discord = require('discord.js');
const { InteractionType } = require('discord.js');

const Event = require('../../structures/Event');
const Context = require('../../structures/Context');
const MessageHelper = require('../../helpers/MessageHelper');
const Playlist = require('../../models/Playlist');
const User = require('../../models/User');

const cooldowns = new Discord.Collection();

module.exports = class InteractionCreate extends Event {
    constructor(...args) {
        super(...args);
    }

    async run(interaction) {

        if (interaction.isButton()) {
            const { buttons } = this.client;
            const button = buttons.get(interaction.customId);
            if (!button) return;

            try {
                await button.run(this.client, interaction);
            }
            catch (error) {
                return this.client.logger.error(error);
            }
        }
        else if (interaction.type == InteractionType.ModalSubmit) {
            const { modals } = this.client;
            const modal = modals.get(interaction.customId);
            if (!modal) return this.client.logger.error(`${interaction.customId} modal was not found`);

            try {
                await modal.run(this.client, interaction);
            }
            catch (error) {
                return this.client.logger.error(error);
            }
        }
        else if (interaction.isAutocomplete()) {
            const playlistCommandsWithAutocomplete = ['view', 'delete', 'add', 'save', 'rename', 'playlistremove', 'load'];
            const queueCommandsWithAutocomplete = ['removefrom', 'remove', 'skipto', 'move'];
            const playCommandsWithAutocomplete = ['play', 'playskip'];
            if (playlistCommandsWithAutocomplete.includes(interaction.commandName)) {
                Playlist.find({
                    creator: interaction.user.id,
                }).sort({ createdTimestamp: 1 }).then(async (p) => {
                    const focusedValue = interaction.options.getFocused();
                    const playlists = [];
                    for (let i = 0; i < p.length; i++) {
                        playlists.push(p[i].name);
                    }
                    const filtered = playlists.filter(choice => choice.startsWith(focusedValue));
                    if (filtered.length > 25) filtered.length = 25;
                    await interaction.respond(filtered.map(choice => ({ name: choice, value: choice })));
                }).catch(() => {
                    return;
                });
            }
            else if (queueCommandsWithAutocomplete.includes(interaction.commandName)) {
                if (!this.client.music.players.get(interaction.guild.id)) return;

                const focusedValue = interaction.options.getFocused();
                const queue = this.client.music.players.get(interaction.guild.id).queue;
                const songs = [];
                for (let i = 0; i < queue.length; i++) {
                    let s = `${i + 1}. ${queue[i].title} • ${queue[i].author}`;
                    if (s.length > 100) s = s.substring(0, 100);
                    songs.push(s);
                }
                const filtered = songs.filter(choice => choice.startsWith(focusedValue));
                if (filtered.length > 25) filtered.length = 25;
                await interaction.respond(filtered.map(choice => ({ name: choice, value: choice })));
            }
            else if (playCommandsWithAutocomplete.includes(interaction.commandName)) {
                const focusedValue = interaction.options.getFocused();

                User.findById(interaction.user.id, async (err, u) => {
                    if (err) this.client.logger.error(err);
                    if (!u) return;
                    const songs = [];
                    for (let i = 0; i < u.songHistory.length; i++) {
                        let s = `${u.songHistory[i].title} • ${u.songHistory[i].author}`;
                        if (s.length > 100) s = s.substring(0, 100);
                        if (!songs.includes(s)) songs.push(s);
                    }
                    const filtered = songs.filter(choice => choice.startsWith(focusedValue));
                    if (filtered.length > 25) filtered.length = 25;
                    await interaction.respond(filtered.map(choice => ({ name: choice, value: choice })));
                });
            }
            else {
                const { commands } = this.client;
                const command = commands.get(interaction.commandName);
                if (!command) return;

                try {
                    await command.autocomplete(this.client, interaction);
                }
                catch (error) {
                    this.client.logger.error(error);
                }
            }
        }
        else if (interaction.type === InteractionType.ApplicationCommand) {
            let cmd;
            let commandName;

            let ctx;
            let contextCommand;
            if (interaction.isMessageContextMenuCommand()) {
                const { contextMenuCommands } = this.client;
                contextCommand = contextMenuCommands.get(interaction.commandName);
                if (!contextCommand) return;
                cmd = contextCommand;
                commandName = cmd.name.toLowerCase();
                ctx = new Context(interaction, []);
                ctx.contextMenuContent = interaction.targetMessage.content;
            }
            else {
                cmd = this.client.commands.get(interaction.commandName);
                if (!cmd || !cmd.slashCommand) return;
                commandName = cmd.name.toLowerCase();
                ctx = new Context(interaction, interaction.options.data);
            }
            const messageHelper = new MessageHelper(this.client, ctx);
            await messageHelper.createServer();
            ctx.messageHelper = messageHelper;

            if (await messageHelper.isIgnored() || await messageHelper.isBlacklisted()) return;

            this.client.databaseHelper.incrementTimesCommandUsed(commandName, ctx.author);
            await messageHelper.createUser();

            if (!cooldowns.has(commandName)) {
                cooldowns.set(commandName, new Discord.Collection());
            }

            if (cmd.permissions.permission === 'dev' && !this.client.config.devs.includes(interaction.user.id)) return;

            this.client.logger.command('%s used by %s from %s', commandName, ctx.author.id, ctx.guild.id);

            const permissionHelpMessage = `If you need help configuring the correct permissions for the bot join the support server: ${this.client.config.server}`;
            cmd.permissions.botPermissions.concat([Discord.PermissionsBitField.Flags.SendMessages, Discord.PermissionsBitField.Flags.EmbedLinks]);
            if (cmd.permissions.botPermissions.length > 0) {
                const missingPermissions = cmd.permissions.botPermissions.filter(perm => !interaction.guild.members.me.permissions.has(perm));
                if (missingPermissions.length > 0) {
                    if (missingPermissions.includes(Discord.PermissionsBitField.Flags.SendMessages)) {
                        const user = this.client.users.cache.get('id');
                        if (!user) return;
                        else if (!user.dmChannel) await user.createDM();
                        await user.dmChannel.send(`I don't have the required permissions to execute this command. Missing permission(s): **${missingPermissions.join(', ')}**\n${permissionHelpMessage}`);
                    }
                    return interaction.reply(`I don't have the required permissions to execute this command. Missing permission(s): **${missingPermissions.join(', ')}**\n${permissionHelpMessage}`);
                }
            }

            if (cmd.permissions.userPermissions.length > 0) {
                const missingPermissions = new Discord.PermissionsBitField(cmd.permissions.userPermissions.filter(perm => !interaction.member.permissions.has(perm))).toArray();
                if (missingPermissions.length > 0) {
                    return interaction.reply({ content: `You don't have the required permissions to execute this command. Missing permission(s): **${missingPermissions.join(', ')}**`, ephemeral: true });
                }
            }

            if (cmd.voiceRequirements.isInVoiceChannel && !interaction.member.voice.channel) return messageHelper.sendResponse('noVoiceChannel');
            else if (cmd.voiceRequirements.isInSameVoiceChannel && interaction.guild.members.me.voice.channel && !interaction.guild.members.me.voice.channel.equals(interaction.member.voice.channel)) return messageHelper.sendResponse('sameVoiceChannel');
            else if (cmd.voiceRequirements.isPlaying && !this.client.music.players.get(interaction.guild.id)) return messageHelper.sendResponse('noSongsPlaying');

            if (cmd.permissions.botPermissions.includes(Discord.PermissionsBitField.Flags.Connect) && !interaction.member.voice.channel.permissionsFor(this.client.user).has(Discord.PermissionsBitField.Flags.Connect)) return messageHelper.sendResponse('noPermissionConnect');
            if (cmd.permissions.botPermissions.includes(Discord.PermissionsBitField.Flags.Speak) && !interaction.member.voice.channel.permissionsFor(this.client.user).has(Discord.PermissionsBitField.Flags.Speak)) return messageHelper.sendResponse('noPermissionSpeak');

            if (!this.client.config.devs.includes(interaction.user.id)) {
                if (!cooldowns.has(commandName)) {
                    cooldowns.set(commandName, new Discord.Collection());
                }
                const now = Date.now();
                const timestamps = cooldowns.get(commandName);
                const cooldownAmount = Math.floor(cmd.cooldown || 5) * 1000;
                if (!timestamps.has(interaction.user.id)) {
                    timestamps.set(interaction.user.id, now);
                    setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);
                }
                else {
                    const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount;
                    const timeLeft = (expirationTime - now) / 1000;
                    if (now < expirationTime && timeLeft > 0.9) {
                        return interaction.reply({ content: `Please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${commandName}\` command.`, ephemeral: true });
                    }
                    timestamps.set(interaction.user.id, now);
                    setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);
                }
            }

            if (ctx.args.includes('@here') || ctx.args.includes('@everyone')) {
                return interaction.reply('Your argument included an `@here` or `@everyone` which is an invalid argument type.');
            }

            try {
                await cmd.run(this.client, ctx, ctx.args);
            }
            catch (error) {
                this.client.logger.error(error);
                await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
            }
        }
    }
};