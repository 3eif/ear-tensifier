const { Utils } = require('@tetracyl/erela.js');

module.exports = (dur) => {
    const duration = Number(dur);
    if(isNaN(duration) || typeof duration === 'undefined') return '00:00';
    if(duration > 3600000000) return 'Live';
    return Utils.formatTime(duration, true);
};