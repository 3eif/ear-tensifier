/* eslint-disable no-shadow */
const fs = require('fs');
const Discord = require('discord.js');

const Command = require('../../structures/Command');

module.exports = class Reload extends Command {
    constructor(client) {
        super(client, {
            name: 'reload',
            description: {
                content: 'Reloads a specific file or command across all shards.',
                usage: '[command/all/file] [command]',
                examples: ['ping', 'all', 'file'],
            },
            args: false,
            permissions: {
                dev: true,
            },
        });
    }
    async run(client, ctx, args) {
        const { commands } = ctx.client;

        if (args[0] === 'all') {
            client.shard.broadcastEval(reloadCommand, { context: { commandsToReload: [] } });
            return ctx.sendMessage(`${client.config.emojis.success} Reloaded all **${commands.size}** command.`);
        }
        else if (!args[0] || args[0] === 'file') {
            let hasReceivedIndexes = false;

            let currentDir = './src';
            let dir = currentDir.split('/').slice(currentDir.split('/').length - 1);
            const files = fs.readdirSync(currentDir).filter((file) => {
                return fs.statSync(currentDir + '/' + file).isFile();
            });
            const folders = fs.readdirSync(currentDir).filter((file) => {
                return fs.statSync(currentDir + '/' + file).isDirectory();
            });
            let dirs = [...folders, ...files];

            let selectMenuArray = [];
            for (let i = 0; i < dirs.length; i++) {
                const dir = dirs[i];
                selectMenuArray.push({
                    label: dir,
                    value: i.toString(),
                });
            }

            let selectMenuRow = new Discord.MessageActionRow()
                .addComponents(
                    new Discord.MessageSelectMenu()
                        .setCustomId(`${ctx.message.id}:SELECT_MENU`)
                        .setPlaceholder('Nothing selected')
                        .addOptions(selectMenuArray),
                );

            let buttonRow = new Discord.MessageActionRow()
                .addComponents(
                    new Discord.MessageButton()
                        .setCustomId(`${ctx.id}:CANCEL_BUTTON`)
                        .setStyle('SECONDARY')
                        .setLabel('Cancel')
                        .setEmoji(client.config.emojis.failure),
                );

            const embed = new Discord.MessageEmbed()
                .setAuthor('Reload File', client.user.displayAvatarURL())
                .setColor(client.config.colors.default)
                .setDescription(`📂 **${dir}**` + folders.map(dir => `\n- 📁 ${dir} `).join('') + files.map(dir => `\n- 📄 ${dir} `).join(''));
            const message = await ctx.sendMessage({ embeds: [embed], components: [selectMenuRow, buttonRow] });

            const buttonCollector = message.createMessageComponentCollector({ componentType: 'BUTTON', time: 15000 });
            buttonCollector.on('collect', async interaction => {
                if (interaction.user.id != ctx.author.id) return;
                if (interaction.customId === `${ctx.id}:CANCEL_BUTTON`) {
                    hasReceivedIndexes = true;
                    return interaction.message.delete();
                }
                else if (interaction.customId === `${ctx.message.id}:BACK_BUTTON`) {
                    currentDir = currentDir.split('/').slice(0, -1).join('/');
                    dir = currentDir.split('/').slice(currentDir.split('/').length - 1);
                    await updateMessage();
                    await interaction.update({ embeds: [embed], components: [selectMenuRow, buttonRow] });
                }
            });

            const selectMenuCollector = message.createMessageComponentCollector({ componentType: 'SELECT_MENU', time: 15000 });
            selectMenuCollector.on('collect', async interaction => {
                if (interaction.user.id != ctx.author.id) return;
                if (interaction.customId != `${ctx.id}:SELECT_MENU`) return;
                if (interaction.member.id != ctx.author.id) return;
                hasReceivedIndexes = true;

                dir = dirs[interaction.values.map(s => parseInt(s))];
                currentDir += `/${dir}`;

                if (fs.statSync(currentDir).isFile()) {
                    const command = client.commands.get(dir.replaceAll('.js', '').toLowerCase());
                    if (command && currentDir.includes('commands/')) client.shard.broadcastEval(reloadCommand, { context: { commandsToReload: [command] } });
                    else client.shard.broadcastEval(reloadFile, { context: { fileToReload: `${process.cwd()}/${currentDir.replaceAll('./', '')}` } });

                    await interaction.update({ components: [] });
                    return ctx.sendMessage(`Reloaded file: \`${dir}\``);
                }

                await updateMessage();
                await interaction.update({ embeds: [embed], components: [selectMenuRow, buttonRow] });
            });

            // eslint-disable-next-line no-inner-declarations
            async function updateMessage() {
                const files = fs.readdirSync(currentDir).filter((file) => {
                    return fs.statSync(currentDir + '/' + file).isFile();
                });
                const folders = fs.readdirSync(currentDir).filter((file) => {
                    return fs.statSync(currentDir + '/' + file).isDirectory();
                });
                dirs = [...folders, ...files];

                embed.setDescription(`📂 **${dir}**` + folders.map(dir => `\n- 📁 ${dir} `).join('') + files.map(dir => `\n- 📄 ${dir} `).join(''));
                selectMenuArray = [];
                for (let i = 0; i < dirs.length; i++) {
                    const dir = dirs[i];
                    selectMenuArray.push({
                        label: dir,
                        value: i.toString(),
                    });
                }

                selectMenuRow = new Discord.MessageActionRow()
                    .addComponents(
                        new Discord.MessageSelectMenu()
                            .setCustomId(`${ctx.message.id}:SELECT_MENU`)
                            .setPlaceholder('Nothing selected')
                            .addOptions(selectMenuArray),
                    );

                buttonRow = new Discord.MessageActionRow();

                if (currentDir != './src') buttonRow.addComponents(
                    new Discord.MessageButton()
                        .setCustomId(`${ctx.id}:BACK_BUTTON`)
                        .setStyle('SECONDARY')
                        .setLabel('Back')
                        .setEmoji(client.config.emojis.left),
                );

                buttonRow.addComponents(
                    new Discord.MessageButton()
                        .setCustomId(`${ctx.id}:CANCEL_BUTTON`)
                        .setStyle('DANGER')
                        .setLabel('Cancel')
                        .setEmoji('🗑️'),
                );
            }

            setTimeout(() => {
                if (!hasReceivedIndexes) return ctx.sendFollowUp('Selection expired.');
            }, 30000);
        }
        else if (args[0] === 'command' || args[0]) {
            const commandStr = args[1] ? args[1] : args[0];
            if (!commands.has(commandStr)) return ctx.sendMessage('That\'s not a valid command!');
            const command = commands.get(commandStr);

            try {
                client.shard.broadcastEval(reloadCommand, { context: { commandsToReload: [command] } });
                return ctx.sendMessage(`Reloaded the **${command.file.name}** command.`);
            }
            catch (e) {
                return ctx.sendMessage(`An error occurred while reloading the command: \n\`\`\`${e.message}\`\`\``);
            }
        }

        function reloadCommand(c, { commandsToReload }) {
            c.reloadCommands(commandsToReload);
        }

        function reloadFile(c, { fileToReload }) {
            c.reloadFile(fileToReload);
        }
    }
};