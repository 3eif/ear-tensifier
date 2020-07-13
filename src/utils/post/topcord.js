const axios = require('axios');

module.exports = async (client, servers, shardCount) => {
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
};