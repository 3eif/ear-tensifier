// Generates html for commands page on https://eartensifier.net/commands

const fs = require('fs');
const categories = fs.readdirSync('./src/commands/');

module.exports = async client => {
    const categoryName = 'sources';

    let commandString = '';
    const commandsArray = [];

    try {
        for (const category of categories) {
            const init = async () => {
                if (category == categoryName) {
                    const commands = fs.readdirSync(`./src/commands/${category}`).filter(file => file.endsWith('.js'));
                    for (const file of commands) {
                        const f = require(`../commands/${category}/${file}`);
                        const command = new f(client);
                        const commandObj = {
                            name: command.name.toLowerCase(),
                            description: command.description,
                            usage: command.usage,
                            aliases: command.aliases,
                        };
                        commandsArray.push(commandObj);
                    }
                }
            };
            init();
        }

        commandsArray.sort((a, b) => a.name - b.name);

        for (let i = 0; i < commandsArray.length; i++) {
            commandsArray[i].usage = commandsArray[i].usage.replace('<', '&lt');
            commandsArray[i].usage = commandsArray[i].usage.replace('>', '&gt');

            let str = `
            <div class="card">
            <div class="card-header" id="${commandsArray[i].name}">
                <h5 class="mb-0">
                    <button class="btn btn-linkk collapsed" data-toggle="collapse"
                        data-target="#collapse${commandsArray[i].name}" aria-expanded="true" aria-controls="collapseSix">
                        <div class="card-h">ear ${commandsArray[i].name} `;

            if (commandsArray[i].usage != 'No usage provided') str += `<small class="text-muted">${commandsArray[i].usage}</small>`;
            str += `</div>
                    </button>
                </h5>
            </div>
            <div id="collapse${commandsArray[i].name}" class="collapse" aria-labelledby="${commandsArray[i]}"
                data-parent="#accordion">
                <div class="card-body">
                    ${commandsArray[i].description}`;

            if (commandsArray[i].aliases != 'N/A') {
                const aliasesWithSpace = commandsArray[i].aliases.join(', ');
                str += `</br></br>Aliases: <kbd>${aliasesWithSpace}</kbd>`;

            }
            str += `</div>
            </div>
        </div>`;

            commandString += str;
        }

        fs.writeFileSync(`./src/utils/commandsHTML/${categoryName}.html`, commandString);
    }
    catch (error) {
        client.log(error);
    }
};