const Discord = require("discord.js");

module.exports = async (type, message, args, edit, msg) => {
    switch (type) {
        case 'noPerms': {
            if(!edit) message.channel.send(`You do not have permission to use this command.`);
            if(edit) msg.edit("", `You do not have permission to use this command.`)
            break;
        }
        case 'reloadError': {
            message.channel.send(`An error occured while reloading \`${args}\`.`)
            break;
        }
        default: {
            message.channel.send(client.error());
        }
    }
}