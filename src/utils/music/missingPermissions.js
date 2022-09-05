const { PermissionsBitField } = require('discord.js');

module.exports = (permissions, channel, member) => {
    const missingPermissions = [];
    const perms = channel.permissionsFor(member);
    for (const perm of permissions) {
        if (!perms.has(perm)) {
            missingPermissions.push(perm);
        }
    }

    return new PermissionsBitField(missingPermissions).toArray();
};