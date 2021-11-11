const { Message, CommandInteraction } = require('discord.js');

module.exports = class Context {
    constructor(ctx, args) {
        this.ctx = ctx;

        this.isInteraction = this.ctx instanceof CommandInteraction;

        this.setArgs(args);

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
            this.msg = this.ctx.reply(content);
            return this.msg;
        }
        else {
            this.msg = this.ctx.channel.send(content);
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

    editMessage(content) {
        if (this.isInteraction) {
            return this.editReply(content);
        }
        else {
            return this.msg.edit(content);
        }
    }

    reply(options) {
        return this.ctx.reply(options);
    }

    deferReply(options) {
        return this.ctx.deferReply(options);
    }

    editReply(options) {
        return this.ctx.editReply(options);
    }
};