const Command = require('../../structures/Command');

module.exports = class Leave extends Command {
    constructor(client) {
        super(client, {
            name: 'leave',
            description: {
                content: 'Leaves the voice channel you are in.',
            },
            aliases: ['disconnect', 'fuckoff', 'leave', 'dc'],
            voiceRequirements: {
                isInVoiceChannel: true,
                isInSameVoiceChannel: true,
            },
            slashCommand: true,
        });
    }

    async run(client, ctx) {
        let player = client.music.players.get(ctx.guild.id);

        if (player) {
            player.destroy();
        }
        else {
            player = await client.music.newPlayer(ctx.guild, ctx.member.voice.channel, ctx.channel);
            await player.connect();
            player.destroy();
        }

        return ctx.sendMessage(`Left <#${ctx.member.voice.channel.id}>`);
    }
};
