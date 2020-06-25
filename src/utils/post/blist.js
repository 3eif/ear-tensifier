const axios = require('axios');

module.exports = async (client, servers, shards, shardCount) => {
    post();
    setInterval(async function() {
        post();
    }, 300000);

    async function post() {
        await axios.post(
            'https://blist.xyz/api/bot/472714545723342848/stats/',
            JSON.stringify({
                'Server-Count': servers.toString(),
                'Shard-Count': shardCount.toString(),
            }),
            {
                method: 'POST',
                headers: {
                    'Authorization': process.env.BLIST_TOKEN,
                    'Content-Type': 'application/json',
                },
            },
        ).then(client.log('Posted bot stats to blist.xyz')).catch(function(error) {
            console.log(error);
        });
    }
};