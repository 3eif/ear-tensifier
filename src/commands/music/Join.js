const { PermissionsBitField } = require('discord.js');
const Command = require('../../structures/Command');

module.exports = class Join extends Command {
    constructor(client) {
        super(client, {
            name: 'join',
            description: {
                content: 'Joins the voice channel you are in.',
            },
            aliases: ['j', 'summon'],
            permissions: {
                botPermissions: [PermissionsBitField.Flags.Connect],
            },
            voiceRequirements: {
                isInVoiceChannel: true,
            },
            slashCommand: true,
        });
    }

    async run(client, ctx) {
        const voiceChannel = ctx.member.voice.channel;
        if (!voiceChannel) return ctx.messageHelper.sendResponse('noVoiceChannel');
        if (ctx.guild.members.me.voice.channel && voiceChannel.id === ctx.guild.members.me.voice.channel.id) return ctx.sendEphemeralMessage('I am already in your voice channel.');

        let player = client.music.players.get(ctx.guild.id);
        if (!player) {
            player = await client.music.newPlayer(ctx.guild, ctx.member.voice.channel, ctx.channel);
            if (!voiceChannel.joinable) return ctx.sendMessage(`I could not join <#${ctx.member.voice.channel.id}> since it was full or I have insufficient permissions to join it.`);
            player.connect();
        }
        else {
            player.voiceChannel = voiceChannel;
            if (!voiceChannel.joinable) return ctx.sendMessage(`I could not join <#${voiceChannel.id}> since it was full or I have insufficient permissions to join it.`);
            await player.connect();
        }

        return ctx.sendMessage(`Joined <#${ctx.member.voice.channel.id}>`);
    }
};
