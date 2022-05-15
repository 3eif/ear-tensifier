const Command = require('../../structures/Command');
const Playlist = require('../../models/Playlist');

module.exports = class Save extends Command {
    constructor(client) {
        super(client, {
            name: 'rename',
            description: {
                content: 'Renames a playlist',
                usage: '<current playlist name> <new playlist name>',
                examples: ['MyPlaylist MyEpicPlaylist'],
            },
            args: true,
            aliases: ['prename'],
            options: [
                {
                    name: 'current',
                    type: 3,
                    required: true,
                    description: 'The playlist\'s current name.',
                },
                {
                    name: 'new',
                    type: 3,
                    required: true,
                    description: 'The playlist\'s new name.',
                },
            ],
        });
    }
    async run(client, ctx, args) {
        if (!args[1]) {
            return ctx.sendMessage(`Please provide a new name for the playlist.\nUsage: \`${await ctx.messageHelper.getPrefix()} rename <current playlist name> <new playlist name>\``);
        }

        if (args[0].length > 32 || args[1].length > 32) return ctx.sendMessage('Playlist title must be less than 32 characters!');
        const playlistName = args[0].replace(/_/g, ' ');
        const newPlaylistName = args[1].replace(/_/g, ' ');

        Playlist.findOne({
            name: playlistName,
            creator: ctx.author.id,
        }, async (err, p) => {
            if (err) client.log(err);
            if (!p) {
                return ctx.sendMessage(`You don't have a playlist named \`${playlistName}\`.`);
            }
            else {
                p.name = newPlaylistName;
                p.save();
                return ctx.sendMessage(`Successfully renamed \`${playlistName}\` to \`${newPlaylistName}\`.`);
            }
        });
    }
};
