const { ActionRowBuilder } = require('@discordjs/builders');
const { ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
const Button = require('../../structures/Button');

module.exports = class AddToQueue extends Button {
    constructor(client) {
        super(client, {
            id: 'ADD_TO_QUEUE_BUTTON',
        });
    }
    async run(client, interaction) {
        if (interaction.guild.members.me.voice.channel && !interaction.guild.members.me.voice.channel.equals(interaction.member.voice.channel)) return;
        const player = client.music.players.get(interaction.guild.id);
        if (!player) return;

        const modal = new ModalBuilder()
            .setCustomId('ADD_TO_QUEUE_MODAL')
            .setTitle('Add a song');

        const textInput = new TextInputBuilder()
            .setCustomId('songToAdd')
            .setLabel('Type another song to queue')
            .setRequired(true)
            .setStyle(TextInputStyle.Short);

        modal.addComponents(new ActionRowBuilder().addComponents(textInput));
        await interaction.showModal(modal);

    }
};