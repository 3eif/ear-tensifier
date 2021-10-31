const Event = require('../../structures/Event');

module.exports = class MessageCreate extends Event {
    constructor(...args) {
        super(...args);
    }

    async run(message) {
        if (message.author.bot) return;
        if (message.channel.type === 'GUILD_TEXT') {
            if (!message.guild.members.cache.get(this.client.user.id)) await message.guild.members.fetch(this.client.user.id);
            if (!message.channel.permissionsFor(message.guild.me).missing('SEND_MESSAGES')) return;
        }

        if (!message.channel.guild) return message.channel.send('I can\'t execute commands inside DMs! Please run this command in a server.');

        let args;
        let command;


        const messageContent = message.content.replace('`', '');

        args = messageContent.split(' ');
        args.shift();
        command = args.shift().toLowerCase();

        let cmd;
        if (this.client.commands.has(command)) cmd = this.client.commands.get(command);
        else if (this.client.aliases.has(command)) cmd = this.client.aliases.get(command);
        else return;

        try {

            cmd.run(this.client, message, args);
        }
        catch (e) {
            console.error(e);
            message.reply('There was an error trying to execute that command!');
        }


    }
};
