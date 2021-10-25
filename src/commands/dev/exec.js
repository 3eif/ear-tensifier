const Command = require('../../structures/Command');

const { MessageEmbed } = require('discord.js');
const { loading } = require('../../../config/emojis.js');
const { invisible } = require('../../../config/colors.js');
const { post } = require('snekfetch');

const util = require('util');
const exec = util.promisify(require('child_process').exec);

module.exports = class Eval extends Command {
    constructor(client) {
        super(client, {
            name: 'exec',
            description: 'Runs shell or bash commands.',
            usage: '<command>',
            args: true,
            permission: 'dev',
        });
    }
    async run(client, message, args) {
        const msg = await message.channel.send(`${loading} Executing command...`);

        const command = args.join(' ');

        try {
            const { stdout } = await exec(command);
            if (stdout.length < 1000) {
                const embed = new MessageEmbed()
                    .addField('Input', `\`\`\`bash\n${command}\`\`\``)
                    .addField('Output', `\`\`\`bash\n${stdout}\`\`\``)
                    .setColor(invisible);
                msg.edit({ content: ' ', embeds: [embed] });
            }
            else {
                const { body } = await post('https://www.hastebin.com/documents').send(stdout);
                const embed = new MessageEmbed()
                    .setTitle('Output was too long, uploaded to hastebin!')
                    .setURL(`https://www.hastebin.com/${body.key}.js`)
                    .setColor(invisible);
                msg.edit({ content: ' ', embeds: [embed] });
            }
        } catch (e) {
            message.channel.send(`Error \`\`\`bash\n${e}\`\`\``);
        }
    }
};