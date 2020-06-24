const patreon = require('../../../config/patreon.js');
const premium = require('../../utils/misc/premium.js');

module.exports = async (id, length) => {
    const songLimit = await getSongLimit(id);
    if (songLimit == patreon.defaultMaxSongs && length >= patreon.defaultMaxSongs) return patreon.defaultMaxSongs;
    if (songLimit == patreon.premiumMaxSongs && length >= patreon.premiumMaxSongs) return patreon.premiumMaxSongs;
    if (songLimit == patreon.proMaxSongs && length >= patreon.proMaxSongs) return patreon.proMaxSongs;
    else return null;
};

async function getSongLimit(id) {
    const hasPremium = await premium(id, 'Premium');
    const hasPro = await premium(id, 'Pro');
    if (!hasPremium && !hasPro) return patreon.defaultMaxSongs;
    if (hasPremium && !hasPro) return patreon.premiumMaxSongs;
    if (hasPremium && hasPro) return patreon.proMaxSongs;
}