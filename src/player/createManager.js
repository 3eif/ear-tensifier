const { Manager } = require('lavaclient');
const { QueuePlugin } = require('lavaclient-queue');

module.exports = async (client) => {
	const nodes = [
		{
			id: 'main',
			host: process.env.LAVALINK_HOST,
			port: process.env.LAVALINK_PORT,
			password: process.env.LAVALINK_PASSWORD,
		},
	];

    client.music = new Manager(nodes, {
        shards: client.shard.count,
        send(id, data) {
            const guild = client.guilds.cache.get(id);
            if (guild) guild.shard.send(data);
            return;
        },
    });

    client.music.use(new QueuePlugin());
    await client.music.init(client.user.id);

    client.music.on('socketError', ({ id }, error) => console.error(`${id} ran into an error`, error));
    client.music.on('socketReady', (node) => console.log(`${node.id} connected.`));
    client.ws.on('VOICE_STATE_UPDATE', (upd) => client.music.stateUpdate(upd));
    client.ws.on('VOICE_SERVER_UPDATE', (upd) => client.music.serverUpdate(upd));
};