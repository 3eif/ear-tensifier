const voteRewards = require('../utils/voting/voteRewards.js');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const router = express.Router();
app.use(bodyParser.json());

app.use((req, res, next) => {
    req.headers['Authorization'] = process.env.DBL_HOOK_PASSWORD;
    if (!req.headers.authorization) {
        return res.status(403).json({ error: 'Password required' });
    }
    next();
});


module.exports.startUp = async (client) => {

    app.listen(2763, function() {
        console.log(`[${new Date().toLocaleString()}] > [READY] DBL Hook Ready! Listening on: 34782`);
      });

    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());

    // eslint-disable-next-line no-unused-vars
    router.post('/discordbotlist', async (req, res) => {
        console.log(req.body.id);
        const id = req.body.id;
		const user = await client.users.fetch(id);
        voteRewards(client, user);
    });

    app.use('/discordbotlist', router);
};