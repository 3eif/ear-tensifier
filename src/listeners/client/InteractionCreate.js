const Discord = require('discord.js');
const fs = require('fs');
const { ButtonStyle, InteractionType } = require('discord.js');

const Event = require('../../structures/Event');
const Context = require('../../structures/Context');
const MessageHelper = require('../../helpers/MessageHelper');
const Playlist = require('../../models/Playlist');

const cooldowns = new Discord.Collection();

module.exports = class InteractionCreate extends Event {
    constructor(...args) {
        super(...args);
    }

    async run(interaction) {
        if (interaction.isButton()) {
            if (interaction.guild.members.me.voice.channel && !interaction.guild.members.me.voice.channel.equals(interaction.member.voice.channel)) return;
            const player = this.client.music.players.get(interaction.guild.id);
            if (!player) return;
            switch (interaction.customId) {
                case 'PREVIOUS_BUTTON': {
                    if (player.queue.previous) {
                        player.queue.unshift(player.queue.previous);
                        player.skip();

                        const embed = new Discord.EmbedBuilder()
                            .setColor(this.client.config.colors.default)
                            .setAuthor({ name: `Backing up to ${player.queue.current.title}`, iconURL: interaction.member.displayAvatarURL() });
                        await player.textChannel.send({ embeds: [embed] });
                    }
                    break;
                }
                case 'PAUSE_BUTTON': {
                    const buttonRow = interaction.message.components[0];
                    player.pause(!player.paused);
                    buttonRow.components[1] = new Discord.ButtonBuilder()
                        .setCustomId('PAUSE_BUTTON')
                        .setStyle(ButtonStyle.Primary)
                        .setEmoji(player.paused ? this.client.config.emojis.resume : this.client.config.emojis.pause);

                    const embed = new Discord.EmbedBuilder()
                        .setColor(this.client.config.colors.default)
                        .setAuthor({ name: `Song is now ${player.playing ? 'resumed' : 'paused'}.`, iconURL: interaction.member.displayAvatarURL() });
                    await player.textChannel.send({ embeds: [embed] });
                    await interaction.update({ components: [buttonRow] });
                    break;
                }
                case 'SKIP_BUTTON': {
                    const title = player.queue.current.title;
                    if (player.trackRepeat) player.setTrackRepeat(false);
                    if (player) player.skip();

                    const embed = new Discord.EmbedBuilder()
                        .setColor(this.client.config.colors.default)
                        .setAuthor({ name: `Skipped ${title}`, iconURL: interaction.member.displayAvatarURL() });
                    await player.textChannel.send({ embeds: [embed] });
                    break;
                }
            }
        }

        if (interaction.isAutocomplete()) {
            if (interaction.commandName === 'help') {
                const focusedValue = interaction.options.getFocused();
                const categories = fs.readdirSync('./src/commands/');
                const { commands } = this.client;
                const helpCommands = [];
                categories.forEach(async (category) => {
                    if (category == 'dev') return;
                    const commandsFile = fs.readdirSync(`./src/commands/${category}`).filter(file => file.endsWith('.js'));
                    for (let i = 0; i < commandsFile.length; i++) {
                        const command = commands.get(commandsFile[i].split('.')[0].toLowerCase());
                        if (command && !command.hide) helpCommands.push(command.name);
                    }
                });
                const filtered = helpCommands.filter(choice => choice.startsWith(focusedValue));
                if (filtered.length > 25) filtered.length = 25;
                await interaction.respond(filtered.map(choice => ({ name: choice, value: choice })));
            }

            const playlistCommandsWithAutocomplete = ['view', 'delete', 'add', 'save', 'rename', 'playlistremove'];
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
        }

        if (interaction.type !== InteractionType.ApplicationCommand) return;

        const cmd = this.client.commands.get(interaction.commandName);
        if (!cmd || !cmd.slashCommand) return;
        const commandName = cmd.name.toLowerCase();

        const ctx = new Context(interaction, interaction.options.data);
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
            const missingPermissions = cmd.permissions.userPermissions.filter(perm => !interaction.member.permissions.has(perm));
            if (missingPermissions.length > 0) {
                return interaction.reply(`You don't have the required permissions to execute this command. Missing permission(s): **${missingPermissions.join(', ')}**`);
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
                    return interaction.reply({ content: `Please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${commandName}\` command.` });
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
};