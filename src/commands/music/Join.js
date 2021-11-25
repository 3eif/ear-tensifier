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
                botPermissions: ['CONNECT'],
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

        let player = client.music.players.get(ctx.guild.id);
        if (!player) {
            player = await client.music.newPlayer(ctx.guild, ctx.member.voice.channel, ctx.channel);
            player.connect();
        }
        else {
            player.voiceChannel = voiceChannel;
            await player.connect();
        }

        return ctx.sendMessage(`Joined <#${ctx.member.voice.channel.id}>`);
    }
};
