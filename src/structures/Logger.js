const { Signale } = require('signale');

module.exports = class Logger extends Signale {
	constructor(config, client) {
		super({
			config: config,
			types: {
				ready: {
					badge: '✔',
					color: 'green',
					label: 'ready',
					logLevel: 'info',
				},
				offline: {
					badge: '⚫',
					color: 'grey',
					label: 'offline',
					logLevel: 'info',
				},
				command: {
					badge: '⌨️',
					color: 'magenta',
					label: 'command',
					logLevel: 'info',
				},
				api: {
					badge: '🛰️',
					color: 'blue',
					label: 'api',
					logLevel: 'info',
				},
			},
			scope: (client ? `Shard ${('00' + client.shard.ids).slice(-3)}` : 'Manager  '),
		});
	}
};