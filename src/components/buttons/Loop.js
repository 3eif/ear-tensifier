const { ButtonStyle, EmbedBuilder, ButtonBuilder } = require('discord.js');
const Button = require('../../structures/Button');

module.exports = class Loop extends Button {
    constructor(client) {
        super(client, {
            id: 'LOOP_BUTTON',
        });
    }
    async run(client, interaction) {
        if (interaction.guild.members.me.voice.channel && !interaction.guild.members.me.voice.channel.equals(interaction.member.voice.channel)) return;
        const player = client.music.players.get(interaction.guild.id);
        if (!player) return;

        let str;
        let style;
        let emoji;
        if (!player.queueRepeat && !player.songRepeat) {
            player.setQueueRepeat(true);
            str = 'Queue is now being looped.';
            style = ButtonStyle.Success;
            emoji = client.config.emojis.loop;
        }
        else if (player.queueRepeat && !player.songRepeat) {
            player.setQueueRepeat(false);
            player.setTrackRepeat(true);
            str = 'Song is now being looped.';
            style = ButtonStyle.Success;
            emoji = client.config.emojis.loopsong;
        }
        else if (player.songRepeat) {
            player.setQueueRepeat(false);
            player.setTrackRepeat(false);
            str = 'Song is no longer being looped.';
            style = ButtonStyle.Primary;
            emoji = client.config.emojis.loop;
        }
        const buttonRow = interaction.message.components[0];
        buttonRow.components[0] = new ButtonBuilder()
            .setCustomId('LOOP_BUTTON')
            .setStyle(style)
            .setEmoji(emoji);

        const embed = new EmbedBuilder()
            .setColor(client.config.colors.default)
            .setAuthor({ name: str, iconURL: interaction.member.displayAvatarURL() });
        await player.textChannel.send({ embeds: [embed] });
        await interaction.update({ components: [buttonRow] });
    }
};