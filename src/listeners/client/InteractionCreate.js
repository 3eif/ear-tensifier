const Discord = require('discord.js');
const { InteractionType, ButtonStyle } = require('discord.js');

const Event = require('../../structures/Event');
const Context = require('../../structures/Context');
const MessageHelper = require('../../helpers/MessageHelper');
const Playlist = require('../../models/Playlist');
const User = require('../../models/User');
const missingPermissions = require('../../utils/music/missingPermissions');

const cooldowns = new Discord.Collection();

module.exports = class InteractionCreate extends Event {
    constructor(...args) {
        super(...args);
    }

    async run(interaction) {
        async function sendBroadcastMessage(client, title, content, buttons) {
            if (interaction.message.embeds.length > 0) {
                const embed = new Discord.EmbedBuilder()
                    .setColor(client.config.colors.default)
                    .setTitle(title.replaceAll('\n', ''))
                    .setDescription(content)
                    .setTimestamp()
                    .setImage('https://cdn.discordapp.com/attachments/689277002988912661/1016478133291069470/ezgif-5-e5b1863bc4.gif')
                    .setFooter({ text: interaction.guild.name, iconURL: interaction.guild.iconURL() });
                await interaction.update({ embeds: [embed], components: buttons });
            }
            else await interaction.update({ content: title + '\n\n' + content });
        }

        if (interaction.isButton()) {
            const broadcastButtons = ['BROADCAST_TRANSLATE_RUSSIAN', 'BROADCAST_TRANSLATE_ENGLISH', 'BROADCAST_TRANSLATE_KOREAN', 'BROADCAST_TRANSLATE_ITALIAN', 'BROADCAST_TRANSLATE_CUSTOM_LANGUAGE'];
            // TODO: Remove later
            if (broadcastButtons.includes(interaction.customId)) {
                const infoButtonRow = new Discord.ActionRowBuilder()
                    .addComponents(
                        new Discord.ButtonBuilder()
                            .setStyle(ButtonStyle.Link)
                            .setLabel('Slash Command FAQ')
                            .setURL('https://support.discord.com/hc/en-us/articles/1500000368501-Slash-Commands-FAQ'),
                        new Discord.ButtonBuilder()
                            .setLabel('Support Server')
                            .setStyle(ButtonStyle.Link)
                            .setURL(this.client.config.server),
                        new Discord.ButtonBuilder()
                            .setStyle(ButtonStyle.Link)
                            .setLabel('Google Translate')
                            .setURL('https://translate.google.com'));

                switch (interaction.customId) {
                    case 'BROADCAST_TRANSLATE_KOREAN': {
                        const title = '**빗금 명령어를 이제 사용해야 해요**';
                        const content = `
9월 1일부로, Discord가 Ear Tensifier 및 다른 타사 봇에 메시지 인텐트(Message Intent)를 제거했어요.
저희가 원해서 한 거거나 바랐던 일이 아니였어요.
                        
지금부터는 봇이 빗금 명령어를 사용하거나 봇을 멘션할 때만 작동할 거예요. \`ear play\`, \`!play\`를 입력하는 대신 </play:916897958446899209>, </skip:916897958606291034> 명령어를 사용하셔야 해요. 빗금 명령어가 보이지 않거나 작동하지 않는 경우, 또는 일반적인 도움이 더 필요하신 경우 아래 지원 서버에 참가하세요.

Ear Tensifier을 사용해 주셔서 감사드려요.

요약: 접두사 \`ear\` 대신 \`/\`을 사용해 주세요. </play:916897958446899209>, </skip:916897958606291034> 처럼요. `;

                        const languageButtonRow = new Discord.ActionRowBuilder()
                            .addComponents(
                                new Discord.ButtonBuilder()
                                    .setCustomId('BROADCAST_TRANSLATE_ITALIAN')
                                    .setLabel('Italiano')
                                    .setStyle(ButtonStyle.Secondary)
                                    .setEmoji('🇮🇹'),
                                new Discord.ButtonBuilder()
                                    .setCustomId('BROADCAST_TRANSLATE_RUSSIAN')
                                    .setLabel('Pусский')
                                    .setStyle(ButtonStyle.Secondary)
                                    .setEmoji('🇷🇺'),
                                new Discord.ButtonBuilder()
                                    .setCustomId('BROADCAST_TRANSLATE_ENGLISH')
                                    .setLabel('English')
                                    .setStyle(ButtonStyle.Secondary)
                                    .setEmoji('🇺🇸'));

                        sendBroadcastMessage(this.client, title, content, [infoButtonRow, languageButtonRow]);
                        break;
                    }
                    case 'BROADCAST_TRANSLATE_ENGLISH': {
                        const title = '**Normal Commands No Longer Working**';
                        const content = `
As of September 1st, Discord has removed the message content privelage from Ear Tensifier and many other bots. This is not something I had a say in or wanted.
               
From now on the bot will only work through slash commands and mentions. Instead of typing \`ear play\` or \`!play\`, type </play:916897958446899209>, </skip:916897958606291034>, instead. If slash commands aren't working or appearing for you, join the support server below.
                        
Thank you for using Ear Tensifier.
    
TLDR: Use \`/\`instead of \`ear\` before each command. E.g: </play:916897958446899209>, </skip:916897958606291034>`;

                        const languageButtonRow = new Discord.ActionRowBuilder()
                            .addComponents(
                                new Discord.ButtonBuilder()
                                    .setCustomId('BROADCAST_TRANSLATE_ITALIAN')
                                    .setLabel('Italiano')
                                    .setStyle(ButtonStyle.Secondary)
                                    .setEmoji('🇮🇹'),
                                new Discord.ButtonBuilder()
                                    .setCustomId('BROADCAST_TRANSLATE_RUSSIAN')
                                    .setLabel('Pусский')
                                    .setStyle(ButtonStyle.Secondary)
                                    .setEmoji('🇷🇺'),
                                new Discord.ButtonBuilder()
                                    .setCustomId('BROADCAST_TRANSLATE_KOREAN')
                                    .setLabel('한국어')
                                    .setStyle(ButtonStyle.Secondary)
                                    .setEmoji('🇰🇷'));

                        sendBroadcastMessage(this.client, title, content, [infoButtonRow, languageButtonRow]);
                        break;
                    }
                    case 'BROADCAST_TRANSLATE_ITALIAN': {
                        const title = '**I comandi normali non funzionano più**';
                        const content = `
Dal 1 settembre, Discord ha rimosso il contenuto dei messaggi privilegiato da Ear Tensifier e molti altri bot. Questo non è qualcosa che mi piace dire o che volevo
           
Da ora il bot funzionerà solo con gli slash commands e menzioni. Invece di scrivere \`ear play\` o \`!play\`, scrivi </play:916897958446899209>, </skip:916897958606291034>, invece. Se gli slash command non funzionano o non appaiono, entra nel server di assistenza sotto.
                                            
Grazie per usare Ear Tensifier.
                        
TLDR: Usa \`/\` invece di \`ear\` prima di ogni comando. E.g: </play:916897958446899209>, </skip:916897958606291034>`;

                        const languageButtonRow = new Discord.ActionRowBuilder()
                            .addComponents(
                                new Discord.ButtonBuilder()
                                    .setCustomId('BROADCAST_TRANSLATE_RUSSIAN')
                                    .setLabel('Pусский')
                                    .setStyle(ButtonStyle.Secondary)
                                    .setEmoji('🇷🇺'),
                                new Discord.ButtonBuilder()
                                    .setCustomId('BROADCAST_TRANSLATE_KOREAN')
                                    .setLabel('한국어')
                                    .setStyle(ButtonStyle.Secondary)
                                    .setEmoji('🇰🇷'),
                                new Discord.ButtonBuilder()
                                    .setCustomId('BROADCAST_TRANSLATE_ENGLISH')
                                    .setLabel('English')
                                    .setStyle(ButtonStyle.Secondary)
                                    .setEmoji('🇺🇸'));

                        sendBroadcastMessage(this.client, title, content, [infoButtonRow, languageButtonRow]);
                        break;
                    }
                    case 'BROADCAST_TRANSLATE_RUSSIAN': {
                        const title = '**Обычные команды больше не работают**';
                        const content = `
                        С первого Сентября, Discord не разглашает текст из сообщений для Ear Tensifier и многих других ботов. Это не то на что я мог повлиять, или хотел чтобы случилось.
           
                        С этого момента, этот бот будет работать только с помощью слеш команд, и упоминаний. 
                        Вместо того чтобы писать \`ear play\` или \`!play\`, пишите </play:916897958446899209>, </skip:916897958606291034>. Если слеш команды не работают для тебя, зайди в сервер поддержки ниже
                                            
                        Спасибо за использование Ear Tensifier.
                        
                        Слишком долго, не прочитал: Используй \`/\` заместо \`ear\` перед каждой командой. Например: </play:916897958446899209>, </skip:916897958606291034>`;

                        const languageButtonRow = new Discord.ActionRowBuilder()
                            .addComponents(
                                new Discord.ButtonBuilder()
                                    .setCustomId('BROADCAST_TRANSLATE_ITALIAN')
                                    .setLabel('Italiano')
                                    .setStyle(ButtonStyle.Secondary)
                                    .setEmoji('🇮🇹'),
                                new Discord.ButtonBuilder()
                                    .setCustomId('BROADCAST_TRANSLATE_KOREAN')
                                    .setLabel('한국어')
                                    .setStyle(ButtonStyle.Secondary)
                                    .setEmoji('🇰🇷'),
                                new Discord.ButtonBuilder()
                                    .setCustomId('BROADCAST_TRANSLATE_ENGLISH')
                                    .setLabel('English')
                                    .setStyle(ButtonStyle.Secondary)
                                    .setEmoji('🇺🇸'));

                        sendBroadcastMessage(this.client, title, content, [infoButtonRow, languageButtonRow]);
                        break;
                    }
                }
            }
            else {
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
                const targetMessage = interaction.targetMessage;
                if (targetMessage.embeds.length > 0) {
                    const embed = targetMessage.embeds[0].data;
                    if (embed) {
                        if (embed.url) ctx.contextMenuContent = embed.url;
                        else if (embed.title) ctx.contextMenuContent = embed.title;
                        else if (embed.description) ctx.contextMenuContent = embed.description;
                    }
                    else {
                        return interaction.reply({ content: 'This command cannot be used on this message', ephemeral: true });
                    }
                }
                else ctx.contextMenuContent = targetMessage.content;
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
            cmd.permissions.botPermissions = cmd.permissions.botPermissions.concat([Discord.PermissionsBitField.Flags.SendMessages, Discord.PermissionsBitField.Flags.EmbedLinks]);
            if (cmd.permissions.botPermissions.length > 0) {
                const missingPerms = missingPermissions(cmd.permissions.botPermissions, interaction.channel, interaction.guild.members.me);
                if (missingPerms.length > 0) {
                    if (missingPerms.includes(Discord.PermissionsBitField.Flags.SendMessages)) {
                        const user = this.client.users.cache.get('id');
                        if (!user) return;
                        else if (!user.dmChannel) await user.createDM();
                        await user.dmChannel.send(`I don't have the required permissions to execute this command. Missing permission(s): **${missingPerms.join(', ')}**\n${permissionHelpMessage}`);
                    }
                    return interaction.reply(`I don't have the required permissions to execute this command. Missing permission(s): **${missingPerms.join(', ')}**\n${permissionHelpMessage}`);
                }
            }

            if (cmd.permissions.userPermissions.length > 0) {
                const missingPerms = missingPermissions(cmd.permissions.userPermissions, interaction.channel, interaction.member);
                if (missingPerms.length > 0) {
                    return interaction.reply({ content: `You don't have the required permissions to execute this command. Missing permission(s): **${missingPerms.join(', ')}**`, ephemeral: true });
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
                return interaction.reply({ content: 'Your argument included an `@here` or `@everyone` which is an invalid argument type.', ephemeral: true });
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
