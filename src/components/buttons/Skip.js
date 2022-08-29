const { EmbedBuilder } = require('discord.js');
const Button = require('../../structures/Button');

module.exports = class Skip extends Button {
    constructor(client) {
        super(client, {
            id: 'SKIP_BUTTON',
        });
    }
    async run(client, interaction) {
        if (interaction.guild.members.me.voice.channel && !interaction.guild.members.me.voice.channel.equals(interaction.member.voice.channel)) return;
        const player = client.music.players.get(interaction.guild.id);
        if (!player) return;

        const title = player.queue.current.title;
        if (player.trackRepeat) player.setTrackRepeat(false);
        if (player) player.skip();

        const embed = new EmbedBuilder()
            .setColor(client.config.colors.default)
            .setAuthor({ name: `Skipped ${title}`, iconURL: interaction.member.displayAvatarURL() });
        await player.textChannel.send({ embeds: [embed] });
    }
};