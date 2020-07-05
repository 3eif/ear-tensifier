const axios = require('axios');

module.exports = async (client, servers, shards, shardCount) => {
    post();
    setInterval(async function() {
        post();
    }, 1800000);

    async function post() {
        await axios.post(
            'https://topcord.xyz/api/bot/stats/472714545723342848/',
            JSON.stringify({
                'guilds': servers.toString(),
                'shards': shardCount.toString(),
            }),
            {
                method: 'POST',
                headers: {
                    'Authorization': process.env.TOPCORD_TOKEN,
                    'Content-Type': 'application/json',
                },
            },
        ).then(client.log('Posted bot stats to topcord.xyz')).catch(function(error) {
            console.log(error);
        });
    }
};