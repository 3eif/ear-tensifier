const Command = require('../../structures/Command');

const util = require('util');
const exec = util.promisify(require('child_process').exec);

module.exports = class Eval extends Command {
    constructor(client) {
        super(client, {
            name: 'restart',
            description: 'Restarts the bot and/or lavalink.',
            usage: '<lavalink or bot>',
            permission: 'dev',
        });
    }
    async run(client, message, args) {
        let str = "";
        let command = "";

        if (!args[0]) {
            str = `Restarting Ear Tensifier and Lavalink...`;
            command = `pm2 restart EarTensifier && pm2 restart Lavalink`;
        } else if (args[0].toLowerCase() == "lavalink") {
            str = `Restarting Lavalink...`;
            command = `pm2 restart Lavalink`;
        } else if (args[0].toLowerCase() == "ear tensifier" || args[0].toLowerCase() == "ear") {
            str = `Restarting Ear Tensifier`;
            command = `pm2 restart EarTensifier`;
        }

        message.channel.send(str);

        try {
            await exec(command);
        } catch (e) {
            message.channel.send(`Error \`\`\`bash\n${e}\`\`\``);
        };

    }
};