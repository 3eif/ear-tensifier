const { EmbedBuilder } = require('discord.js');
const { ApplicationCommandType } = require('discord-api-types');

const Command = require('../../structures/Command');
const User = require('../../models/User');

module.exports = class Profile extends Command {
    constructor(client) {
        super(client, {
            name: 'profile',
            description: {
                content: 'Displays a user\'s profile.',
                usage: '<user>',
                examples: ['@user', 'user#1234'],
            },
            slashCommand: true,
        });
    }
    async run(client, ctx, args) {
        await ctx.sendDeferMessage(`${client.config.emojis.typing} Fetching profile...`);

        let user;
        if (ctx.interaction) user = ctx.member;
        else user = ctx.message.mentions.members.first() || ctx.guild.members.cache.get(args[0]) || ctx.member;
        if (!user) return ctx.editMessage('User not found');
        User.findById(user.id, async (err, u) => {
            if (err) client.logger.error(err);
            if (!u) {
                const newUser = new User({ _id: user.id });

                newUser.save().catch(e => client.logger.error(e));

                const embed = new EmbedBuilder()
                    .setThumbnail(user.user.displayAvatarURL())
                    .addFields({ name: 'User', value: `${user.user.tag}`, inline: true }, { name: 'Bio', value: 'No bio set' })
                    .setColor(client.config.colors.default)
                    .setFooter('Commands Used: 0 | Songs Played: 0')
                    .setTimestamp();
                return ctx.editMessage({ content: null, embeds: [embed] });
            }
            else {
                const bio = u.bio ? u.bio : 'No bio set. To set your bio type `ear bio <desired bio>`';
                const embed = new EmbedBuilder()
                    .setThumbnail(user.user.displayAvatarURL())
                    .addFields({ name: 'User', value: `${user.user.tag}`, inline: true }, { name: 'Bio', value: bio })
                    .setColor(client.config.colors.default)
                    .setFooter(`Commands Used: ${u.commandsUsed} | Songs Played: ${u.songsPlayed}`)
                    .setTimestamp();
                return ctx.editMessage({ content: null, embeds: [embed] });
            }
        });
    }
};