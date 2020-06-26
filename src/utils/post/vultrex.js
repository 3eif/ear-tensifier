const axios = require('axios');

module.exports = async (client, servers, shards, shardCount) => {
    post();
    setInterval(async function() {
        post();
    }, 300000);

    async function post() {
        await axios.post(
            'https://api.vultrex.co/v3/bot/472714545723342848/stats',
            JSON.stringify({
                serverCount: servers,
                shardCount: shardCount,
            }),
            {
                method: 'POST',
                headers: {
                    Authorization: process.env.VULTREX_TOKEN,
                    'Content-Type': 'application/json',
                },
            },
        ).then(client.log('Posted bot stats to vultrex.co')).catch(function(error) {
            console.log(error);
        });
    }
};