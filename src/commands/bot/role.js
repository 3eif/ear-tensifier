const Command = require('../../structures/Command');

const Discord = require('discord.js');
const getVoted = require('../../utils/voting/getVoted.js');
const servers = require('../../models/server.js');

module.exports = class Role extends Command {
    constructor(client) {
        super(client, {
            name: 'role',
            description: 'Gives you the voted role.',
        });
    }
    async run(client, message) {

        if(!message.guild.me.hasPermission('MANAGE_ROLES')) return message.channel.send('I don\'t have permission to add roles.');

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
                return message.chanel.send(`This server does not have a role system set up! Please contact Tetracyl#0096 to get it set up: ${client.settings.server}`);
            }
            else if (s.roleSystem) {
                const voted = await getVoted(client, message.author);
                if (!voted) {
                    const voteEmbed = new Discord.MessageEmbed()
                        .setDescription('You must **vote** to get this role. You can vote [here](https://top.gg/bot/472714545723342848/vote)')
                        .setColor(client.colors.main);
                    return message.channel.send(voteEmbed);
                }
                else {
                    const member = message.member;
                    const role = message.guild.roles.cache.find(r => r.name === 'Tensifier');

                    if (!role) return message.channel.send('Role not found.');

                    if(member.roles.cache.has(role)) return message.channel.send('You already have the role!');
                    member.roles.add(role.id);

                    const embed = new Discord.MessageEmbed()
                        .setDescription('You now have the **voted** role!')
                        .setColor(client.colors.main);
                    return message.channel.send(embed);
                }
            }
            else {
                console.log(s.roleSystem);
                return message.channel.send(`This server does not have a role system set up! Please contact Tetracyl#0096 to get it set up: ${client.settings.server}`);
            }
        });
    }
};