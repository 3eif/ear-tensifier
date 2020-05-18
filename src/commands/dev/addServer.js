const Command = require('../../structures/Command');

const servers = require('../../models/server.js');

module.exports = class AddServer extends Command {
    constructor(client) {
        super(client, {
            name: 'addserver',
            permission: 'dev',
        });
    }
    async run(client, message) {
        const msg = await message.channel.send(`${client.emojiList.loading} Setting up role system...`);

        servers.findOne({
            serverID: message.guild.id,
        }, async (err, s) => {
            if (err) this.client.log(err);
            if (!s) {
                const newServer = new servers({
                    serverID: message.guild.id,
                    prefix: this.client.settings.prefix,
                    ignore: [],
                    roleSystem: true,
                });
                await newServer.save().catch(e => this.client.log(e));
            }
            else {
                s.roleSystem = true;
                await s.save().catch(e => client.log(e));
            }
            return msg.edit('Role system has been setup.');
        });
    }
};