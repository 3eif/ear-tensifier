const patreon = require('../../../config/patreon.js');
const premium = require('../../utils/misc/premium.js');

module.exports = async (id) => {
    const hasPremium = await premium(id, 'Premium');
    const hasPro = await premium(id, 'Pro');
    if (!hasPremium && !hasPro) return patreon.defaultMaxSongs;
    if (hasPremium && !hasPro) return patreon.premiumMaxSongs;
    if (hasPremium && hasPro) return patreon.proMaxSongs;
};