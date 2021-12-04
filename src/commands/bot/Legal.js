const { MessageEmbed } = require('discord.js');

const Command = require('../../structures/Command');

module.exports = class Legal extends Command {
    constructor(client) {
        super(client, {
            name: 'legal',
            description: {
                content: 'Sends Ear Tensifier\'s privacy policy.',
            },
            aliases: ['privacy', 'policy', 'privacypolicy', 'privacy-policy', 'privacy policy'],
            args: false,
            slashCommand: false,
        });
    }

    async run(client, ctx) {
        const embed = new MessageEmbed()
            .setTitle('Privacy Policy')
            .setDescription('This Privacy Policy contains the data Ear Tensifier collects and what its used for.')
            .addField('What We Collect', `
• User IDs: Used to store profiles, voting rewards and premium/pro features.
• Server IDs: Used to store server options such as custom prefixes, and ignored channels.
• Submitted data. This includes user and server options, and stored playlists.
        `)
            .addField('How We Use The Data', `
The data is used to make the bot functional and customizable. Without this data custom prefixes, profiles, playlists and more would not be supported. We will not share or sell user's data to any 3rd party companies or individuals. 
        `)
            .addField('Concerns', `
If you have concerns regarding the data we collect or you would like to delete your data please join the [support server](${client.config.server}) or contact \`Tetracyl#0001\` on Discord.
        `)
            .setTimestamp();
        await ctx.sendMessage({ content: null, embeds: [embed] });
    }
};
