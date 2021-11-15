const { MessageEmbed, MessageAttachment } = require('discord.js');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

const Command = require('../../structures/Command');

module.exports = class Execute extends Command {
    constructor(client) {
        super(client, {
            name: 'execute',
            description: {
                content: 'Runs bash commands.',
                usage: '<command>',
                examples: ['ls', 'ping www.google.com'],
            },
            aliases: ['exec', 'sh', 'bash'],
            args: true,
            permissions: {
                dev: true,
            },
        });
    }
    async run(client, ctx, args) {
        await ctx.sendDeferMessage(`${client.config.emojis.typing} Executing command...`);

        const command = args.join(' ');

        try {
            const { stdout } = await exec(command);
            const output = clean(stdout);

            if (output.includes(process.env.DISCORD_TOKEN)) return ctx.editMessage('Cannot run command since the token will be leaked.');

            if (output.length < 1024) {
                const embed = new MessageEmbed()
                    .addField('Input', `\`\`\`bash\n${command}\`\`\``)
                    .addField('Output', `\`\`\`bash\n${output}\`\`\``)
                    .setColor(client.config.colors.default);
                ctx.editMessage({ content: null, embeds: [embed] });
            }
            else {
                const attachmened = new MessageAttachment(Buffer.from(output), 'output.txt');
                ctx.editMessage({ content: null, files: [attachmened] });
            }
        }
        catch (e) {
            ctx.editMessage(`Error \`\`\`bash\n${e}\`\`\``);
        }
    }
};

function clean(text) {
    if (typeof (text) === 'string')
        return text.replace(/`/g, '`' + String.fromCharCode(8203)).replace(/@/g, '@' + String.fromCharCode(8203));
    else
        return text;
}