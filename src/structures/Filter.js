const { Structure } = require('@tetracyl/erela.js');

Structure.extend('player', Player => class extends Player {
    setFilter(filters) {
        const guild = this.guild;
        const type = 'filters';
        return this.socket.send({
            type,
            filters,
            guild,
        });
    }
});
