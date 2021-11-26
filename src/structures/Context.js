const { Message, CommandInteraction } = require('discord.js');

module.exports = class Context {
    constructor(ctx, args) {
        this.isInteraction = ctx instanceof CommandInteraction;

        this.setArgs(args);

        this.interaction = this.isInteraction ? ctx : null;
        this.message = this.isInteraction ? null : ctx;

        this.id = ctx.id;
        this.applicationId = ctx.applicationId;
        this.channelId = ctx.channelId;
        this.guildId = ctx.guildId;
        this.client = ctx.client;
        this.author = ctx instanceof Message ? ctx.author : ctx.user;
        this.channel = ctx.channel;
        this.guild = ctx.guild;
        this.member = ctx.member;
        this.createdAt = ctx.createdAt;
        this.createdTimestamp = ctx.createdTimestamp;
    }

    setArgs(args) {
        if (this.isInteraction) {
            this.args = args.map(arg => arg.value);
        }
        else {
            this.args = args;
        }
    }

    sendMessage(content) {
        if (this.isInteraction) {
            this.msg = this.interaction.reply(content);
            return this.msg;
        }
        else {
            this.msg = this.message.channel.send(content);
            return this.msg;
        }
    }

    async sendDeferMessage(content) {
        if (this.isInteraction) {
            this.msg = await this.deferReply({ fetchReply: true });
            return this.msg;
        }
        else {
            this.msg = await this.channel.send(content);
            return this.msg;
        }
    }

    async sendFollowUp(content) {
        if (this.isInteraction) {
            await this.followUp(content);
        }
        else {
            this.channel.send(content);
        }
    }

    editMessage(content) {
        if (this.isInteraction) {
            return this.editReply(content);
        }
        else {
            return this.msg.edit(content);
        }
    }

    reply(options) {
        return this.interaction.reply(options);
    }

    deferReply(options) {
        return this.interaction.deferReply(options);
    }

    editReply(options) {
        return this.interaction.editReply(options);
    }

    followUp(options) {
        return this.interaction.followUp(options);
    }
};