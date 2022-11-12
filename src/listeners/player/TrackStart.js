const { EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle, PermissionsBitField } = require('discord.js');

const DatabaseHelper = require('../../helpers/DatabaseHelper');
const Event = require('../../structures/Event');
const formatDuration = require('../../utils/music/formatDuration');
const missingPermissions = require('../../utils/music/missingPermissions');

module.exports = class TrackStart extends Event {
    constructor(...args) {
        super(...args);
    }

    async run(player, track) {
        const { title, url, requester, author, thumbnail } = track;
        const duration = (player.getDuration() || track.duration);

        this.client.databaseHelper.incrementTotalSongsPlayed();
        // this.client.databaseHelper.incrementTimesSongsPlayed(id, title, url, duration, platform, thumbnail, author);
        this.client.databaseHelper.incrementUserSongsPlayed(requester);
        this.client.databaseHelper.addToSongHistory(track, requester);

        player.nowPlayingMessage = null;

        const shouldSend = await DatabaseHelper.shouldSendNowPlayingMessage(player.textChannel.guild);
        if (!shouldSend) return;

        // if (player.nowPlayingMessageInterval) clearInterval(player.nowPlayingMessageInterval);

        const n = 13;
        const parsedCurrentDuration = formatDuration(0);
        const parsedDuration = formatDuration(duration);
        const part = Math.floor((player.getTime() / duration) * n);
        const percentage = player.getTime() / duration;

        const buttonRow = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('LOOP_BUTTON')
                    .setStyle(!player.queueRepeat && !player.trackRepeat ? ButtonStyle.Secondary : ButtonStyle.Primary)
                    .setEmoji(player.trackRepeat ? this.client.config.emojis.loopsong : this.client.config.emojis.loop),
                new ButtonBuilder()
                    .setCustomId('PREVIOUS_BUTTON')
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji(this.client.config.emojis.previous),
                new ButtonBuilder()
                    .setCustomId('PAUSE_BUTTON')
                    .setStyle(ButtonStyle.Primary)
                    .setEmoji(this.client.config.emojis.pause),
                new ButtonBuilder()
                    .setCustomId('SKIP_BUTTON')
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji(this.client.config.emojis.skip),
                new ButtonBuilder()
                    .setCustomId('ADD_TO_QUEUE_BUTTON')
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji(this.client.config.emojis.addtoqueue));

        try {
            const missingPerms = missingPermissions([PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.EmbedLinks], player.textChannel, player.guild.members.me);
            if (missingPerms.length > 0) return;
            const embed = new EmbedBuilder()
                .setColor(this.client.config.colors.default)
                .setAuthor({ name: author, iconURL: player.playing ? 'https://eartensifier.net/images/cd.gif' : 'https://eartensifier.net/images/cd.png' })
                .setThumbnail(thumbnail)
                .setTitle(title)
                .setFooter({ text: requester.username })
                .setTimestamp();
            if (duration != -1) embed.setDescription(`${parsedCurrentDuration}  ${percentage < 0.05 ? this.client.config.emojis.progress7 : this.client.config.emojis.progress1}${this.client.config.emojis.progress2.repeat(part)}${percentage < 0.05 ? '' : this.client.config.emojis.progress3}${this.client.config.emojis.progress5.repeat(12 - part)}${this.client.config.emojis.progress6}  ${parsedDuration}`);
            player.nowPlayingMessage = await player.textChannel.send({ embeds: [embed], components: [buttonRow] });
            player.queue.current.duration = duration;
            // if (!player.nowPlayingMessageInterval) player.nowPlayingMessageInterval = setInterval(() => {
            //     if (!player.player || !player.nowPlayingMessage) return clearInterval(player.nowPlayingMessageInterval);
            //     parsedCurrentDuration = formatDuration(player.getTime());
            //     parsedDuration = formatDuration(duration);
            //     part = Math.floor((player.getTime() / duration) * n);
            //     percentage = player.getTime() / duration;

            //     const e = new EmbedBuilder(embed.setDescription(`${parsedCurrentDuration}  ${percentage < 0.05 ? this.client.config.emojis.progress7 : this.client.config.emojis.progress1}${this.client.config.emojis.progress2.repeat(part)}${percentage < 0.05 ? '' : this.client.config.emojis.progress3}${this.client.config.emojis.progress5.repeat(12 - part)}${this.client.config.emojis.progress6}  ${parsedDuration}`));
            //     if (player.nowPlayingMessage) player.nowPlayingMessage.edit({ content: null, embeds: [e] });
            // }, 60000);
        }
        catch (err) {
            this.client.logger.error(err);
        }
    }
};
