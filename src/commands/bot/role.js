const Command = require('../../structures/Command');

const { MessageEmbed } = require('discord.js');
const servers = require('../../models/server.js');

module.exports = class Role extends Command {
    constructor(client) {
        super(client, {
            name: 'role',
            description: 'Gives you the voted role.',
        });
    }
    async run(client, message) {

        if (!message.guild.me.permissions.has('MANAGE_ROLES')) return message.channel.send('I don\'t have permission to add roles.');

        servers.findOne({
            serverID: message.guild.id,
        }, async (err, s) => {
            if (err) this.client.log(err);
            if (!s) {
                const newServer = new servers({
                    serverID: message.guild.id,
                    prefix: this.client.settings.prefix,
                    ignore: [],
                    roleSystem: false,
                });
                await newServer.save().catch(e => this.client.log(e));
                return message.chanel.send(`This server does not have a role system set up! Please contact Tetracyl#0001 to get it set up: ${client.settings.server}`);
            }
            else if (s.roleSystem) {
                const member = message.member;
                const role = message.guild.roles.cache.find(r => r.name === 'Tensifier');

                if (!role) return message.channel.send('Role not found.');

                if (member.roles.cache.has(role)) return message.channel.send('You already have the role!');
                member.roles.add(role.id);

                const embed = new MessageEmbed()
                    .setDescription('You now have the **voted** role!')
                    .setColor(client.colors.main);
                return message.channel.send({ embeds: [embed] });

            }
            else {
                console.log(s.roleSystem);
                return message.channel.send(`This server does not have a role system set up! Please contact Tetracyl#0096 to get it set up: ${client.settings.server}`);
            }
        });
    }
};
