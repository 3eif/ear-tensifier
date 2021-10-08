<div align="center">
    <img src="https://github.com/Tetracyl/EarTensifier/blob/master/assets/eartensifier.png?raw=true" width="140px" height="140px" /><br>
</div>

<div align="center">

![Discord](https://img.shields.io/discord/473426453204172811?color=7289DA)
[![Discord Bots](https://top.gg/api/widget/status/472714545723342848.svg?noavatar=true)](https://top.gg/bot/472714545723342848)
[![Discord Bots](https://top.gg/api/widget/servers/472714545723342848.svg?noavatar=true)](https://top.gg/bot/472714545723342848)
![GitHub](https://img.shields.io/github/license/Tetracyl/EarTensifier)

</div>

<h1>Ear Tensifier</h1>

Ear Tensifier is a powerful discord bot written in javascript using the discord.js library and Lavalink client. Ear Tensifier can play music from Youtube, SoundCloud, bandcamp and Twitch and includes more than 50 unique commands.

## Add to Discord
Click [here](https://eartensifier.net/invite) to invite Ear Tensifier to your server. 

By default, Ear Tensifier's prefix is set to `ear `  and can be changed by doing `ear prefix <new prefix>`. For a full list of commands, type `ear help` or `ear help <command>` for specific details on a command. A detailed list of commands can be found [here](https://eartensifier.net/commands).

## License
This project is licensed under the GNU General Public License v3.0 - see the [LICENSE](LICENSE) file for details.

## Self Hosting
Ear Tensifier is open source to allow people to contribute to the bot, gain inspiration/ideas from the bot's code, or host a private version of the bot for your own use. You may NOT however host your own clone of Ear Tensifier publicly or list your clone on bot list.

These instructions assume that you have some experience with creating and running Discord Bots. If you have any questions or issues self hosting the bot, feel free to ask on the [Discord server](https://discord.gg/xKgKMAP).

### Prerequisites

Requirements for the API and other tools to build, test and push 
- [Node.js](https://nodejs.org/en/download/) 14.0.0 or newer is required
- A [MongoDB](https://www.mongodb.com/) instance running
- An instance of a custom version of [lavalink](https://github.com/melike2d/lavalink) running
- A Discord Bot 

### Installing

Clone the repo on your machine

    git clone https://github.com/Tetracyl/EarTensifier

Navigate to the newly created EarTensifier folder and install the npm packages

    npm install

### Credentials

Navigate to the `.env.example` file and rename it to `.env`. 
Then fill out the following credentials:

1. Set the `DISCORD_PREFIX` key to the prefix you wish the bot to respond to.
2. Set the `DISCORD_ID` key to your bot's ID.
3. Set the `DISCORD_TOKEN` key to your bot's token.
4. Set the `MONGO_URL` key to your monogdb's connection URL.
5. Set the `LAVALINK_HOST` key to the IP address of the machine you're hosting the lavalink instance on.
6. Set the `LAVALINK_PORT` key to the port the lavalink instance is being hosted on.
7. Set the `LAVALINK_PASSWORD` key to the password located in the Lavalink application.yml file.

### Deployment

To deploy the bot simply run:

    npm start

If you installed and setup eveything correctly then the bot should output something like this:

    [10/7/2021, 8:00:14 PM] > [Shard 1] Ready
    [10/7/2021, 8:00:14 PM] > Ear Tensifier is online: 1 shards, 1 server and 1 member.
    _____             _____              _  __ _ 
    | ____|__ _ _ __  |_   _|__ _ __  ___(_)/ _(_) ___ _ __
    |  _| / _` | '__|   | |/ _ \ '_ \/ __| | |_| |/ _ \ '__|
    | |__| (_| | |      | |  __/ | | \__ \ |  _| |  __/ |
    |_____\__,_|_|      |_|\___|_| |_|___/_|_| |_|\___|_|
            

## Contributors
- [2D](https://github.com/MeLike2D): Provided modified lavalink version with filters.
- [MrAugu](https://github.com/MrAugu): Cleaned up spaghetti code.
- [Sxmurai](https://github.com/Sxmurai/): Cleaned up spaghetti code.

## Bot Lists
[![Bots On Discord](https://bots.ondiscord.xyz/bots/472714545723342848/embed?theme=dark&showGuilds=true)](https://bots.ondiscord.xyz/bots/472714545723342848)
[![Discord Bots](https://top.gg/api/widget/472714545723342848.svg)](https://top.gg/bot/472714545723342848)
[![Discord Bot List](https://discordbotlist.com/api/bots/ear-tensifier/widget)](https://discordbotlist.com/bots/ear-tensifier)
[![Discord Boats](https://discord.boats/api/widget/472714545723342848)](https://discord.boats/bot/472714545723342848)
[![Bots for Discord](https://botsfordiscord.com/api/bot/472714545723342848/widget)](https://botsfordiscord.com/bots/472714545723342848)
