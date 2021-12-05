const Command = require('../../structures/Command');

const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const fs = require('fs');
const categories = fs.readdirSync('./src/commands/');


module.exports = class Help extends Command {
    constructor(client) {
        super(client, {
            name: 'help',
            description: {
                content: 'Sends you a detailed list of the bot\'s commands.',
                usage: '[comamnd]',
                examples: ['', 'play', 'seek'],
            },
            aliases: ['commands', 'list'],
            options: [{
                name: 'command',
                type: 3,
                required: false,
                description: 'The command to view the help page of.',
            }],
            slashCommand: true,
        });
    }
    async run(client, ctx, args) {

        const { commands } = ctx.client;
        const data = [];

        const prefix = await ctx.messageHelper.getPrefix();

        const embed = new MessageEmbed()
            .setAuthor('Commands', client.user.displayAvatarURL())
            .setDescription(`A detailed list of commands can be found here: **[eartensifier.net/commands](https://eartensifier.net/commands)**.\nNeed more help? Join the support server here: **[${client.config.server.replace('https://', '')}](${client.config.server})**.`)
            .setFooter(`For more information on a command: ${prefix}help <command>`)
            .setColor(client.config.colors.default);

        if (!args.length) {

            const buttons = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setLabel('Support Server')
                        .setStyle('LINK')
                        .setURL(client.config.server),
                    new MessageButton()
                        .setLabel('Website')
                        .setStyle('LINK')
                        .setURL(client.config.website),
                );

            categories.forEach(async (category) => {
                if (category == 'dev') return;

                const helpCommands = [];
                let categoryCommands = '';
                const commandsFile = fs.readdirSync(`./src/commands/${category}`).filter(file => file.endsWith('.js'));

                for (let i = 0; i < commandsFile.length; i++) {
                    const command = commands.get(commandsFile[i].split('.')[0].toLowerCase());
                    if (command && !command.hide) {
                        if (i < commandsFile.length - 1) helpCommands.push(`\`${command.name}\`,  `);
                        else helpCommands.push(`\`${command.name}\``);
                    }
                }

                for (let i = 0; i < helpCommands.length; i++) categoryCommands += helpCommands[i];
                const categoryName = category.charAt(0).toUpperCase() + category.slice(1);
                embed.addField(`${categoryName} (${commandsFile.length})`, categoryCommands);
            });

            await ctx.sendMessage({ embeds: [embed], components: [buttons] });
        }
        else {
            if (!commands.has(args[0])) return ctx.sendMessage('That\'s not a valid command!');

            const command = commands.get(args[0]);

            data.push(`**Name:** ${command.name}`);

            if (command.description.content) data.push(`**Description:** ${command.description.content}`);

            if (command.description.usage == 'No usage provided') data.push(`**Usage:** \`${prefix}${command.name}\``);
            else data.push(`**Usage:** \`${prefix}${command.name} ${command.description.usage}\``);

            if (command.description.examples != 'No examples provided') {
                const examples = [];
                command.description.examples.forEach(example => examples.push(`\`${prefix}${command.name} ${example}\``));
                data.push(`**Examples:** ${examples.join(', ')}`);
            }

            if (command.aliases == 'No aliases for this certain command') data.push('**Aliases:** This command has no aliases');
            else data.push(`**Aliases:** \`${command.aliases}\``);

            data.push(`**Cooldown:** ${command.cooldown || 3} second(s)`);

            return ctx.sendMessage(data.join('\n'));
        }
    }
};