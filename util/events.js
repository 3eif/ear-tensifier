const fs = require("fs")
const events = fs.readdirSync('./events');
const jsevents = events.filter(c => c.split('.').pop() === 'js');
if (!events.length) throw Error('No event files found!');

module.exports = (client) => {
    for (let i = 0; i < jsevents.length; i++) {
        if (!jsevents.length) throw Error('No javascript event files found!');
        const file = require(`../events/${jsevents[i]}`);
        const event = new file(client, file);
        //console.log(`Event loaded: ${event.name}`);
        if (typeof event.run !== 'function') throw Error(`No run function found in ${jsevents[i]}`);
        let name = jsevents[i].split('.')[0];
        client.on(name, (...args) => event.run(...args));
    }
};