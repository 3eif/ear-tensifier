const Event = require('../../structures/Event');

module.exports = class InteractionCreate extends Event {
    constructor(...args) {
        super(...args);
    }

    async run(interaction) {
        if (!interaction.isCommand()) return;

        const command = this.client.commands.get(interaction.commandName);
        if (!command) return;

        try {
            await command.execute(this.client, interaction, interaction.options.data);
        }
        catch (error) {
            this.client.logger.error(error);
            await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
        }
    }
};