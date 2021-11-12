const { MessageButton, MessageActionRow } = require('discord.js');

const Server = require('../models/Server.js');
const User = require('../models/User.js');
const { emojis } = require('../../config.json');

module.exports = class MessageHelper {
    constructor(client, ctx) {
        this.client = client;
        this.ctx = ctx;
    }

    async createServer() {
        this.server = await Server.findById(this.ctx.guild.id);
        if (!this.server) {
            const newServer = new Server({
                _id: this.ctx.guild.id,
            });
            await newServer.save();
            this.server = newServer;
        }
    }

    async createUser() {
        this.user = await User.findById(this.ctx.author.id);
        if (!this.user) {
            const newUser = new User({
                _id: this.ctx.author.id,
                commandsUsed: 1,
            });
            await newUser.save().catch(e => this.client.log(e));
            this.user = await User.findOne({ authorID: this.ctx.author.id });
        }
    }

    async getPrefix(rawMessageContent, mentionPrefix) {
        if (rawMessageContent.indexOf(this.client.config.prefix) === 0) {
            return this.client.config.prefix;
        }
        else if (rawMessageContent.indexOf(this.server.prefix.toLowerCase()) === 0) {
            return this.server.prefix;
        }
        else if (rawMessageContent.split(' ')[0].match(mentionPrefix)) {
            return mentionPrefix;
        }
        else {
            return undefined;
        }
    }

    async isBlacklisted() {
        if (this.user.blocked == null) this.user.blocked = false;
        if (!this.user.blocked) {
            this.user.commandsUsed += 1;
        }
        await this.user.updateOne({ commandsUsed: this.user.commandsUsed, blocked: this.user.blocked });
        return this.user.blocked;
    }

    isIgnored() {
        return this.server.ignoredChannels.includes(this.ctx.channel.id);
    }

    sendResponse(type) {
        switch (type) {
            case 'sameVoiceChannel': {
                this.ctx.sendMessage('You are not in the same voice channel as the bot.');
                break;
            }
            case 'noVoiceChannel': {
                this.ctx.sendMessage('You need to be in a voice channel to use this command.');
                break;
            }
            case 'noSongsPlaying': {
                this.ctx.sendMessage('There are no songs currently playing, please play a song to use the command.');
                break;
            }
            case 'botVoiceChannel': {
                this.ctx.sendMessage('The bot is not currently in a vc.');
                break;
            }
            case 'noPermissionConnect': {
                this.ctx.sendMessage('I do not have permission to join your voice channel.');
                break;
            }
            case 'noPermissionSpeak': {
                this.ctx.sendMessage('I do not have permission to speak in your voice channel.');
                break;
            }
            case 'noUser': {
                this.ctx.sendMessage('Please provide a valid user.');
                break;
            }
            default: {
                this.ctx.sendMessage(this.client.error());
            }
        }
    }


    static async paginate(ctx, pages, timeout, buttonRow) {
        if (pages.length < 2) return;

        let page = 0;

        const buttons = buttonRow ? buttonRow : new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('back')
                    .setLabel('Back')
                    .setStyle('PRIMARY')
                    .setEmoji(emojis.left),
                new MessageButton()
                    .setCustomId('next')
                    .setLabel('Next')
                    .setStyle('PRIMARY')
                    .setEmoji(emojis.right),
            );

        const message = await ctx.sendMessage({
            embeds: [pages[page]],
            components: [buttons],
            fetchReply: true,
        });

        const interactionCollector = message.createMessageComponentCollector({ max: pages.length * 2 });

        interactionCollector.on('collect', async (interaction) => {
            if (interaction.component.customId === 'prev') {
                if (page === 0) return;
                page--;
            }
            else if (interaction.component.customId === 'next') {
                if (page === pages.length - 1) return;
                page++;
            }


            await interaction.update({
                embeds: [pages[page]],
            });
        });

        interactionCollector.on('end', async () => {
            await message.edit({ components: [] });
        });

        setTimeout(async () => {
            interactionCollector.stop('Timeout');
            await message.edit({ components: [] });
        }, timeout ? timeout : 300000);
    }
};