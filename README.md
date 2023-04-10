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

[Ear Tensifier](https://eartensifier.net/) is a powerful discord bot written in JavaScript using the [discord.js](https://github.com/discordjs/discord.js) library and [yasha](https://github.com/ilikdoge/yasha) and [sange](https://github.com/ilikdoge/sange) to deliver audio.

## Add to Discord
Click [here](https://eartensifier.net/invite) to invite Ear Tensifier to your server. 

By default, Ear Tensifier's prefix is set to `ear `  and can be changed by doing `ear prefix <new prefix>`. For a full list of commands, type `ear help` or `ear help <command>` for specific details on a command. A detailed list of commands can be found [here](https://eartensifier.net/commands).

## License
This project is licensed under the GNU General Public License v3.0 - see the [LICENSE](LICENSE) file for details.

## Self Hosting

NOTE: WINDOWS AND MACOS ARE NOT OFFICIALLY SUPPORTED BY EAR TENSIFIER, THE BOT IS ONLY ABLE TO RUN ON LINUX. IF YOU ARE USING WINDOWS YOU CAN STILL RUN IT USING [WINDOWS SUBSYSTEM FOR LINUX](https://docs.microsoft.com/en-us/windows/wsl/install).

These instructions assume that you have some experience with creating and running Discord Bots. If you have any questions or issues self hosting the bot, feel free to ask on the [Discord server](https://discord.gg/xKgKMAP).

> This self hosting guide is a WIP. If you have any suggestions or edits please make an issue or pull request.

### Prerequisites

Requirements for Ear Tensifier to run:
- [Node.js](https://nodejs.org/en/download/) 16.6.0 or newer is required
- A [MongoDB](https://www.mongodb.com/) instance running
- A Discord Bot 
- Install [sange](https://github.com/ilikdoge/sange) dependencies
- Install [yasha](https://github.com/ilikdoge/yasha) dependencies

### Installing

Clone the repo on your machine

    git clone https://github.com/Tetracyl/EarTensifier

Navigate to the newly created EarTensifier folder and install the npm packages

    npm install

### Credentials

Navigate to the `.env.example` file and rename it to `.env`. 
Then fill out the following credentials:

1. Set the `PREFIX` key to the prefix you wish the bot to respond to.
2. Set the `CLIENT_ID` key to your bot's ID and the `CLIENT_USERNAME` to the bot's username.
3. Set the `DISCORD_TOKEN` key to your bot's token.
4. Set the `MONGO_URL` key to your monogdb's connection URL.

### Deployment

To deploy the bot simply run:

    npm start

If you installed and setup eveything correctly then the bot should output something like this:
 
    [12/4/2021] [1:33:49 PM] [Manager] › ✔  ready     Shard 0 created
    [12/4/2021] [1:33:52 PM] [Shard 0] › ✔  ready     Shard 0 ready
    [12/4/2021] [1:33:52 PM] [Shard 0] › ✔  ready     Ear Tensifier is ready
    [12/4/2021] [1:33:52 PM] [Shard 0] › 🛰️  api       API listening at http://localhost:2872
            

## Contributors
- [2D](https://github.com/MeLike2D): Provided modified lavalink version with filters
- [MrAugu](https://github.com/MrAugu): Cleaned up spaghetti code
- [Sxmurai](https://github.com/Sxmurai/): Cleaned up spaghetti code
- [Omar](https://github.com/HysMX): Fixed Youtube playlist bug
- [lmpham1](https://github.com/lmpham1): Added clean command
- [rajamoulimallareddy](https://github.com/rajamoulimallareddy): Updated bot to discord.js v13
- [ilikdoge](https://github.com/ilikdoge): Helped with implementation of yasha and overall development of bot
- [Berus](https://github.com/berusvn): Added lyrics command

## Bot Lists
[![Bots On Discord](https://bots.ondiscord.xyz/bots/472714545723342848/embed?theme=dark&showGuilds=true)](https://bots.ondiscord.xyz/bots/472714545723342848)
[![Discord Bots](https://top.gg/api/widget/472714545723342848.svg)](https://top.gg/bot/472714545723342848)
[![Discord Bot List](https://discordbotlist.com/api/bots/ear-tensifier/widget)](https://discordbotlist.com/bots/ear-tensifier)
[![Discord Boats](https://discord.boats/api/widget/472714545723342848)](https://discord.boats/bot/472714545723342848)
