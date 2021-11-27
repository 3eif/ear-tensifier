const { Signale } = require('signale');
const { isMaster } = require('cluster');

module.exports = class Logger extends Signale {
	constructor(config) {
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
			},
			scope: `${isMaster ? 'Parent Cluster' : `Cluster ${process.env.CLUSTER_ID}`}`,
		});
	}
};