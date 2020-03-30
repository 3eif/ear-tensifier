const fs = require('fs');
const categories = fs.readdirSync('./src/commands/');

module.exports = client => {
	try {
		categories.forEach(async (category) => {
			fs.readdir(`./src/commands/${category}/`, (err) => {
				if (err) return console.error(err);
				const init = async () => {
					const commands = fs.readdirSync(`./src/commands/${category}`).filter(file => file.endsWith('.js'));
					for (const file of commands) {
						const command = require(`../../commands/${category}/${file}`);
						client.commands.set(command.name, command);
					}
				};
				init();
			});
		});
	}
	catch (error) {
		client.log(error);
	}
};