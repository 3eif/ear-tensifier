const { Utils } = require('@tetracyl/erela.js');

module.exports = (duration) => {
    if(isNaN(duration) || typeof duration === 'undefined') return '00:00';
    if(duration > 360000000) return 'Live';
    return Utils.formatTime(duration, true);
};