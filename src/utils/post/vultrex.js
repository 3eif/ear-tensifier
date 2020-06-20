const axios = require('axios').default;

module.exports = async (client, servers, shards, shardCount) => {
    setInterval(async function() {
        await axios.post(
            'https://api.vultrex.io/v3/bot/472714545723342848/stats',
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
        ).catch(function(error) {
            console.log(error);
        });
    }, 1800000);
};