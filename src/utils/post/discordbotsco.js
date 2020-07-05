const axios = require('axios');

module.exports = async (client, servers, shards, shardCount) => {
    // const apiClient = new APIClient(process.env.DISCORDBOTSCO_TOKEN, client.user.id);
    // await apiClient.post(servers);
    await post();
    setInterval(async function() {
        await post();
    }, 300000);

    async function post() {
        await axios.post(
            'https://api.discordbots.co/v1/public/bot/472714545723342848/stats',
            JSON.stringify({
                serverCount: servers,
                shardCount: shardCount,
            }),
            {
                method: 'POST',
                headers: {
                    Authorization: process.env.DISCORDBOTSCO_TOKEN,
                    'Content-Type': 'application/json',
                },
            },
        ).then(client.log('Posted bot stats to discordbots.co')).catch(function(error) {
            console.log(error);
        });
    }
};