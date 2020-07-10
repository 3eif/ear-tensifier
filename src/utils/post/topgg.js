const axios = require('axios');

module.exports = async (client, servers, shards, shardCount) => {
    await axios.post(
        'https://top.gg/api/bots/472714545723342848/stats',
        JSON.stringify({
            'server_count': servers,
            'shards': shards,
            'shard_count': shardCount,
        }),
        {
            method: 'POST',
            headers: {
                'Authorization': process.env.TOPGG_TOKEN,
                'Content-Type': 'application/json',
            },
        },
    ).then(client.log('Posted bot stats to top.gg')).catch(function(error) {
        console.log(error);
    });
};